import normalizeTableSelection from '../utils/normalizeTableSelection';
import { clearState } from '../utils/clearState';
import { contains, getTagOfNode, safeInstanceOf, VTable } from 'roosterjs-editor-dom';
import { getCellAtCursor } from '../utils/getCellAtCursor';
import { getCellCoordinates } from '../utils/getCellCoordinates';
import { getTableAtCursor } from '../utils/getTableAtCursor';
import { prepareSelection } from '../utils/prepareSelection';
import { restoreSelection } from '../utils/restoreSelection';
import { selectTable } from '../utils/selectTable';
import { setData } from '../utils/setData';
import { TABLE_CELL_SELECTOR } from '../constants';
import { updateSelection } from '../utils/updateSelection';
import type { IEditor, PluginMouseDownEvent } from 'roosterjs-editor-types';
import type { TableCellSelectionState } from '../TableCellSelectionState';

const LEFT_CLICK = 1;
const RIGHT_CLICK = 3;

/**
 * @internal
 */
export function handleMouseDownEvent(
    event: PluginMouseDownEvent,
    state: TableCellSelectionState,
    editor: IEditor
) {
    const { which, shiftKey, target, detail } = event.rawEvent;
    const table = editor.getElementAtCursor('table', target as Node, event);
    const tripleClick = detail >= 3;

    if (table && !table.isContentEditable) {
        return;
    }

    const td = editor.getElementAtCursor(TABLE_CELL_SELECTOR);
    if (which == RIGHT_CLICK && state.tableSelection && state.vTable && td) {
        //If the user is right clicking To open context menu
        const coord = getCellCoordinates(state.vTable, td);
        if (coord) {
            const { firstCell, lastCell } = normalizeTableSelection(state.vTable) || {};
            if (
                firstCell &&
                lastCell &&
                coord.y >= firstCell.y &&
                coord.y <= lastCell.y &&
                coord.x >= firstCell.x &&
                coord.x <= lastCell.x
            ) {
                state.firstTarget = state.vTable.getCell(firstCell.y, firstCell.x).td;
                state.lastTarget = state.vTable.getCell(lastCell.y, lastCell.x).td;

                if (state.firstTarget && state.lastTarget) {
                    const selection = editor.getDocument().defaultView?.getSelection();
                    selection?.setBaseAndExtent(state.firstTarget, 0, state.lastTarget, 0);
                    selectTable(editor, state);
                }

                return;
            }
        }
    }
    if (which == LEFT_CLICK) {
        if (!shiftKey && !tripleClick) {
            clearState(state, editor);

            if (getTableAtCursor(editor, event.rawEvent.target)) {
                const doc = editor.getDocument() || document;

                const mouseUpListener = getOnMouseUp(state);
                const mouseMoveListener = onMouseMove(state, editor);
                doc.addEventListener('mouseup', mouseUpListener, true /*setCapture*/);
                doc.addEventListener('mousemove', mouseMoveListener, true /*setCapture*/);

                state.mouseMoveDisposer = () => {
                    doc.removeEventListener('mouseup', mouseUpListener, true /*setCapture*/);
                    doc.removeEventListener('mousemove', mouseMoveListener, true /*setCapture*/);
                };

                state.startedSelection = true;
            }
        }

        if (shiftKey || tripleClick) {
            editor.runAsync(editor => {
                const sel = editor.getDocument().defaultView?.getSelection();
                const first = getCellAtCursor(editor, sel?.anchorNode);
                // Triple clicking a cell will select that cell only
                // Assign last the same as first to make sure we can select the cell
                const last = tripleClick ? first : getCellAtCursor(editor, sel?.focusNode);
                const firstTable = getTableAtCursor(editor, first);
                if (
                    firstTable &&
                    safeInstanceOf(first, 'HTMLTableCellElement') &&
                    safeInstanceOf(last, 'HTMLTableCellElement')
                ) {
                    state.vTable = new VTable(first);
                    const firstCord = getCellCoordinates(state.vTable, first);
                    const lastCord = getCellCoordinates(state.vTable, last);

                    if (!firstCord || !lastCord) {
                        return;
                    }
                    state.vTable.selection = {
                        firstCell: firstCord,
                        lastCell: lastCord,
                    };

                    state.firstTarget = first;
                    state.lastTarget = last;
                    selectTable(editor, state);

                    state.tableSelection = true;
                    state.firstTable = firstTable as HTMLTableElement;
                    state.targetTable = firstTable;
                    updateSelection(editor, first, 0);
                }
            });
        }
    }
}

function getOnMouseUp(state: TableCellSelectionState) {
    return () => {
        removeMouseUpEventListener(state);
    };
}

function onMouseMove(state: TableCellSelectionState, editor: IEditor) {
    return (event: MouseEvent) => {
        if (!editor.contains(event.target as Node)) {
            return;
        }

        //If already in table selection and the new target is contained in the last target cell, no need to
        //Apply selection styles again.
        if (
            state.tableSelection &&
            state.firstTarget &&
            contains(state.lastTarget, event.target as Node, true)
        ) {
            updateSelection(editor, state.firstTarget, 0);
            event.preventDefault();
            return;
        }

        if (getTagOfNode(event.target as Node) == 'TABLE') {
            event.preventDefault();
            return;
        }

        setData(event.target as Node, state, editor);

        // If there is a first target, but is not inside a table, no more actions to perform.
        if (state.firstTarget && !state.firstTable) {
            return;
        }

        //Ignore if
        // Is a DIV that only contains a Table
        // If the event target is not contained in the editor.
        if (
            state.lastTarget &&
            ((state.lastTarget.lastChild == state.lastTarget.firstChild &&
                getTagOfNode(state.lastTarget.lastChild) == 'TABLE' &&
                getTagOfNode(state.lastTarget) == 'DIV') ||
                !editor.contains(state.lastTarget))
        ) {
            event.preventDefault();
            return;
        }

        prepareSelection(state, editor);
        const isNewTDContainingFirstTable = safeInstanceOf(state.lastTarget, 'HTMLTableCellElement')
            ? contains(state.lastTarget, state.firstTable)
            : false;

        if (
            (state.firstTable && state.firstTable == state.targetTable) ||
            isNewTDContainingFirstTable
        ) {
            //When starting selection inside of a table and ends inside of the same table.
            selectionInsideTableMouseMove(event, state, editor);
        } else if (state.tableSelection) {
            restoreSelection(state, editor);
        }

        if (state.tableSelection && state.firstTarget) {
            updateSelection(editor, state.firstTarget, 0);
            event.preventDefault();
        }
    };
}

/**
 * @internal
 */
export function selectionInsideTableMouseMove(
    event: MouseEvent,
    state: TableCellSelectionState,
    editor: IEditor
) {
    if (
        state.firstTarget &&
        state.firstTable &&
        state.lastTarget != state.firstTarget &&
        state.lastTarget
    ) {
        updateSelection(editor, state.firstTarget, 0);
        if (
            state.firstTable != state.targetTable &&
            state.targetTable?.contains(state.firstTable)
        ) {
            //If selection started in a table that is inside of another table and moves to parent table
            //Make the firstTarget the TD of the parent table.
            state.firstTarget = editor.getElementAtCursor(TABLE_CELL_SELECTOR, state.lastTarget);
        }

        if (state.firstTable && state.firstTarget) {
            state.tableSelection = true;

            state.vTable = state.vTable || new VTable(state.firstTable);

            const firstCell = getCellCoordinates(state.vTable, state.firstTarget);
            const lastCell = getCellCoordinates(state.vTable, state.lastTarget);

            if (!firstCell || !lastCell) {
                return;
            }

            state.vTable.selection = {
                firstCell,
                lastCell,
            };
            selectTable(editor, state);
        }

        event.preventDefault();
    } else if (
        state.lastTarget == state.firstTarget &&
        state.tableSelection &&
        state.firstTable &&
        state.firstTarget
    ) {
        state.vTable = new VTable(state.firstTable);
        const cell = getCellCoordinates(state.vTable, state.firstTarget);
        if (cell) {
            state.vTable.selection = {
                firstCell: cell,
                lastCell: cell,
            };
        }

        selectTable(editor, state);
    }
}

function removeMouseUpEventListener(state: TableCellSelectionState): void {
    if (state.startedSelection) {
        state.startedSelection = false;
        state.mouseMoveDisposer?.();
    }
}
