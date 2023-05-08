import { getCellAtCursor } from '../utils/getCellAtCursor';
import { getCellCoordinates } from '../utils/getCellCoordinates';
import { isAfter } from '../utils/isAfter';
import { prepareSelection } from '../utils/prepareSelection';
import { selectTable } from '../utils/selectTable';
import { setData } from '../utils/setData';
import { TABLE_CELL_SELECTOR } from '../constants';
import { TableCellSelectionState } from '../TableCellSelectionState';
import { updateSelection } from '../utils/updateSelection';
import {
    contains,
    isCtrlOrMetaPressed,
    Position,
    safeInstanceOf,
    VTable,
} from 'roosterjs-editor-dom';
import {
    Coordinates,
    IEditor,
    Keys,
    PluginKeyDownEvent,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export function handleKeyDownEvent(
    event: PluginKeyDownEvent,
    state: TableCellSelectionState,
    editor: IEditor
) {
    const { shiftKey, ctrlKey, metaKey, which, defaultPrevented } = event.rawEvent;
    if ((shiftKey && (ctrlKey || metaKey)) || which == Keys.SHIFT || defaultPrevented) {
        state.preventKeyUp = defaultPrevented;
        return;
    }

    if (shiftKey) {
        if (!state.firstTarget) {
            const pos = editor.getFocusedPosition();
            const cell = pos && getCellAtCursor(editor, pos.node);

            state.firstTarget = cell;
        }

        //If first target is not a table cell, we should ignore this plugin
        if (!safeInstanceOf(state.firstTarget, 'HTMLTableCellElement')) {
            return;
        }
        editor.runAsync(editor => {
            const pos = editor.getFocusedPosition();
            const newTarget = state.tableSelection ? state.lastTarget : pos?.node;
            if (newTarget) {
                setData(newTarget, state, editor);
            }

            if (state.firstTable! == state.targetTable!) {
                if (!shouldConvertToTableSelection(state, editor) && !state.tableSelection) {
                    return;
                }
                //When selection start and end is inside of the same table
                handleKeySelectionInsideTable(event, state, editor);
            } else if (state.tableSelection) {
                if (state.firstTable) {
                    editor.select(state.firstTable, null /* coordinates */);
                }
                state.tableSelection = false;
            }
        });
    } else if (
        editor.getSelectionRangeEx()?.type == SelectionRangeTypes.TableSelection &&
        (!isCtrlOrMetaPressed(event.rawEvent) || which == Keys.HOME || which == Keys.END)
    ) {
        editor.select(null);
    }
}

/**
 * @internal
 */
function handleKeySelectionInsideTable(
    event: PluginKeyDownEvent,
    state: TableCellSelectionState,
    editor: IEditor
) {
    state.firstTarget = getCellAtCursor(editor, state.firstTarget);
    state.lastTarget = getCellAtCursor(editor, state.lastTarget);

    updateSelection(editor, state.firstTarget, 0);
    state.vTable = state.vTable || new VTable(state.firstTable as HTMLTableElement);

    const firstCell = getCellCoordinates(state.vTable, state.firstTarget as Element);
    const lastCell = getNextTD(event, editor, state);

    if (!firstCell || !lastCell) {
        return;
    }
    state.vTable.selection = {
        firstCell,
        lastCell,
    };

    const { selection } = state.vTable;

    if (
        !selection.lastCell ||
        (state.vTable.cells && selection.lastCell.y > state.vTable.cells.length - 1) ||
        selection.lastCell.y == -1
    ) {
        //When selection is moving from inside of a table to outside
        state.lastTarget = editor.getElementAtCursor(
            TABLE_CELL_SELECTOR + ',div',
            state.firstTable ?? undefined
        );
        if (safeInstanceOf(state.lastTarget, 'HTMLTableCellElement')) {
            prepareSelection(state, editor);
        } else {
            const position =
                state.targetTable &&
                new Position(
                    state.targetTable,
                    selection.lastCell.y == null || selection.lastCell.y == -1
                        ? PositionType.Before
                        : PositionType.After
                );

            const sel = editor.getDocument().defaultView?.getSelection();
            const { anchorNode, anchorOffset } = sel || {};
            if (
                sel &&
                anchorNode &&
                anchorOffset != undefined &&
                anchorOffset != null &&
                position
            ) {
                editor.select(sel.getRangeAt(0));
                sel.setBaseAndExtent(anchorNode, anchorOffset, position.node, position.offset);
                state.lastTarget = position.node;
                event.rawEvent.preventDefault();
                return;
            }
        }
    }

    selectTable(editor, state);

    const isBeginAboveEnd = isAfter(state.firstTarget, state.lastTarget);
    if (state.lastTarget) {
        const targetPosition = new Position(
            state.lastTarget,
            isBeginAboveEnd ? PositionType.Begin : PositionType.End
        );
        updateSelection(editor, targetPosition.node, targetPosition.offset);
    }

    state.tableSelection = true;
    event.rawEvent.preventDefault();
}

function getNextTD(
    event: PluginKeyDownEvent,
    editor: IEditor,
    state: TableCellSelectionState
): Coordinates | undefined {
    state.lastTarget =
        state.lastTarget && editor.getElementAtCursor(TABLE_CELL_SELECTOR, state.lastTarget);

    if (safeInstanceOf(state.lastTarget, 'HTMLTableCellElement') && state.vTable?.cells) {
        let coordinates = getCellCoordinates(state.vTable, state.lastTarget);

        if (state.tableSelection && coordinates) {
            switch (event.rawEvent.which) {
                case Keys.RIGHT:
                    coordinates.x += state.lastTarget.colSpan;
                    if (state.vTable.cells[coordinates.y][coordinates.x] == null) {
                        coordinates.x = state.vTable.cells[coordinates.y].length - 1;
                        coordinates.y++;
                    }
                    break;
                case Keys.LEFT:
                    if (coordinates.x == 0) {
                        coordinates.y--;
                    } else {
                        coordinates.x--;
                    }
                    break;
                case Keys.UP:
                    coordinates.y--;
                    break;
                case Keys.DOWN:
                    coordinates.y++;
                    break;
            }
        }

        if (coordinates && coordinates.y >= 0 && coordinates.x >= 0) {
            state.lastTarget = state.vTable.getTd(coordinates.y, coordinates.x);
        }
        return coordinates;
    }
    return undefined;
}

function shouldConvertToTableSelection(state: TableCellSelectionState, editor: IEditor) {
    if (!state.firstTable || !editor) {
        return false;
    }
    const regions = editor.getSelectedRegions();
    if (regions.length == 1) {
        return false;
    }

    let result = true;

    regions.forEach(value => {
        if (!contains(state.firstTable, value.rootNode)) {
            result = false;
        }
    });

    return result;
}
