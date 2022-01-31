import TableSelector from './tableSelector/tableSelector';
import { clearSelectedTableCells } from './utils/clearSelectedTableCells';
import { clearSelectedTables } from './utils/clearSelectedTables';
import { forEachSelectedCell } from './utils/forEachSelectedCell';
import { getCellCoordinates } from './utils/getCellCoordinates';
import { highlight } from './utils/highlight';
import { highlightAll } from './utils/highlightAll';
import { removeCellsOutsideSelection } from './utils/removeCellsOutsideSelection';
import { tableCellSelectionCommon } from './utils/tableCellSelectionCommon';
import {
    BeforeCutCopyEvent,
    BuildInEditFeature,
    Coordinates,
    EditorPlugin,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PositionType,
    Rect,
    SelectionRangeTypes,
    TableSelection,
} from 'roosterjs-editor-types';
import {
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    VTable,
    Position,
    contains,
    normalizeRect,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = 'td,th';
const TABLE_SELECTED = tableCellSelectionCommon.TABLE_SELECTED;
const TABLE_CELL_SELECTED = tableCellSelectionCommon.TABLE_CELL_SELECTED;
const LEFT_CLICK = 1;
const RIGHT_CLICK = 3;
const TABLE_SELECTOR_LENGTH = 12;

/**
 * TableCellSelectionPlugin help highlight table cells
 */
export default class TableCellSelection implements EditorPlugin {
    private editor: IEditor;
    // State properties
    private lastTarget: Node;
    private firstTarget: Node;
    private tableRange: TableSelection;
    private tableSelection: boolean;
    private startedSelection: boolean;
    private vTable: VTable;
    private firstTable: HTMLTableElement;
    private targetTable: HTMLElement;

    //TableSelector Props
    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private tableSelector: TableSelector;

    constructor() {
        this.tableRange = {
            firstCell: null,
            lastCell: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableCellSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.editor.addContentEditFeature(this.DeleteTableContents);
        this.onMouseMoveDisposer = this.editor.addDomEventHandler({
            mousemove: this.onMouseMoveSelector,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.invalidateTableRects();
        this.setTableSelector(null);
        this.removeMouseUpEventListener();
        this.clearState();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.ExtractContentWithDom:
                    clearSelectedTables(event.clonedRoot);
                    break;
                case PluginEventType.BeforeCutCopy:
                    this.handleBeforeCutCopy(event);
                    break;
                case PluginEventType.MouseDown:
                    if (!this.startedSelection) {
                        this.handleMouseDownEvent(event);
                    }
                    break;
                case PluginEventType.KeyDown:
                    if (!this.startedSelection) {
                        this.handleKeyDownEvent(event);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.KeyUp:
                    if (!this.startedSelection) {
                        this.handleKeyUpEvent(event);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.Input:
                case PluginEventType.ContentChanged:
                case PluginEventType.Scroll:
                    this.setTableSelector(null);
                    this.invalidateTableRects();
                    if (event.eventType == PluginEventType.Scroll && this.startedSelection) {
                        this.handleScrollEvent();
                    }
                    break;
            }
        }
    }

    /**
     * Handle Scroll Event and mantains the selection range,
     * Since when we scroll the cursor does not trigger the on Mouse Move event
     * The table selection gets removed.
     */
    private handleScrollEvent() {
        this.setData(this.editor.getElementAtCursor());
        if (this.firstTable == this.targetTable) {
            if (this.tableSelection) {
                this.vTable.selection.lastCell = getCellCoordinates(this.vTable, this.lastTarget);
                highlight(this.vTable);
                this.tableRange.lastCell = this.vTable.selection.lastCell;
                updateSelection(this.editor, this.firstTarget, 0);
            }
        } else if (this.tableRange) {
            this.restoreSelection();
        }
    }

    /**
     * Handles the Before Copy Event.
     * Clear the selection range from the cloned Root.
     * @param event plugin event
     */
    private handleBeforeCutCopy(event: BeforeCutCopyEvent) {
        const clonedTable = event.clonedRoot.querySelector('table.' + TABLE_SELECTED);
        if (clonedTable) {
            const clonedVTable = new VTable(clonedTable as HTMLTableElement);
            clonedVTable.selection = this.tableRange;
            removeCellsOutsideSelection(clonedVTable);
            clonedVTable.writeBack();

            event.range.selectNode(clonedTable);

            if (event.isCut) {
                forEachSelectedCell(this.vTable, cell => {
                    if (cell?.td) {
                        deleteNodeContents(cell.td, this.editor);
                    }
                });
            }
            clearSelectedTables(event.clonedRoot);
        }
    }

    //#region Key events
    /**
     * Handles the on key event.
     * @param event the plugin event
     */
    private handleKeyDownEvent(event: PluginKeyDownEvent) {
        const { shiftKey, ctrlKey, metaKey, which } = event.rawEvent;
        if ((shiftKey && (ctrlKey || metaKey)) || which == Keys.SHIFT) {
            return;
        }

        if (shiftKey) {
            if (!this.firstTarget) {
                const pos = this.editor.getFocusedPosition();

                const cell = getCellAtCursor(this.editor, pos.node);

                this.firstTarget = this.firstTarget || cell;
            }

            //If first target is not a table cell, we should ignore this plugin
            if (!safeInstanceOf(this.firstTarget, 'HTMLTableCellElement')) {
                return;
            }
            this.editor.runAsync(editor => {
                const pos = editor.getFocusedPosition();
                this.setData(this.tableSelection ? this.lastTarget : pos.node);

                if (this.firstTable! == this.targetTable!) {
                    if (!this.shouldConvertToTableSelection() && !this.tableSelection) {
                        return;
                    }
                    //When selection start and end is inside of the same table
                    this.handleKeySelectionInsideTable(event);
                } else if (this.tableSelection) {
                    clearSelectedTableCells(this.editor);
                    this.tableSelection = false;
                }
            });
        }
    }

    private handleKeyUpEvent(event: PluginKeyUpEvent) {
        const { shiftKey, which } = event.rawEvent;
        if (!shiftKey && which != Keys.SHIFT && this.firstTarget) {
            this.clearState();
        }
    }

    private handleKeySelectionInsideTable(event: PluginKeyDownEvent) {
        this.firstTarget = getCellAtCursor(this.editor, this.firstTarget);
        this.lastTarget = getCellAtCursor(this.editor, this.lastTarget);

        updateSelection(this.editor, this.firstTarget, 0);
        this.vTable = this.vTable || new VTable(this.firstTable as HTMLTableElement);
        this.tableRange.firstCell = getCellCoordinates(this.vTable, this.firstTarget as Element);
        this.tableRange.lastCell = this.getNextTD(event);

        if (
            !this.tableRange.lastCell ||
            this.tableRange.lastCell.y > this.vTable.cells.length - 1 ||
            this.tableRange.lastCell.y == -1
        ) {
            //When selection is moving from inside of a table to outside
            this.lastTarget = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR + ',div',
                this.firstTable
            );
            if (safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')) {
                this.prepareSelection();
            } else {
                const position = new Position(
                    this.targetTable,
                    this.tableRange.lastCell.y == null || this.tableRange.lastCell.y == -1
                        ? PositionType.Before
                        : PositionType.After
                );

                const sel = this.editor.getDocument().defaultView.getSelection();
                const { anchorNode, anchorOffset } = sel;
                sel.setBaseAndExtent(anchorNode, anchorOffset, position.node, position.offset);
                this.lastTarget = position.node;
                event.rawEvent.preventDefault();
                return;
            }
        }

        this.vTable.selection = this.tableRange;
        highlight(this.vTable);

        const isBeginAboveEnd = this.isAfter(this.firstTarget, this.lastTarget);
        const targetPosition = new Position(
            this.lastTarget,
            isBeginAboveEnd ? PositionType.Begin : PositionType.End
        );
        updateSelection(this.editor, targetPosition.node, targetPosition.offset);

        this.tableSelection = true;
        event.rawEvent.preventDefault();
    }
    //#endregion

    //#region Mouse events
    private handleMouseDownEvent(event: PluginMouseDownEvent) {
        const { which, shiftKey } = event.rawEvent;

        if (which == RIGHT_CLICK && this.tableSelection) {
            //If the user is right clicking To open context menu
            const td = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR);
            if (td?.classList.contains(TABLE_CELL_SELECTED)) {
                this.firstTarget = null;
                this.lastTarget = null;

                this.editor.queryElements('td.' + TABLE_CELL_SELECTED, node => {
                    this.firstTarget = this.firstTarget || node;
                    this.lastTarget = node;
                });
                const selection = this.editor.getDocument().defaultView.getSelection();
                selection.setBaseAndExtent(this.firstTarget, 0, this.lastTarget, 0);
                highlight(this.vTable);
                return;
            }
        }
        this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
        if (which == LEFT_CLICK && !shiftKey) {
            this.clearState();
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            this.startedSelection = true;
        }

        if (which == LEFT_CLICK && shiftKey) {
            this.editor.runAsync(editor => {
                const sel = editor.getDocument().defaultView.getSelection();
                const first = getCellAtCursor(editor, sel.anchorNode);
                const last = getCellAtCursor(editor, sel.focusNode);
                const firstTable = getTableAtCursor(editor, first);
                const targetTable = getTableAtCursor(editor, first);
                if (
                    firstTable! == targetTable! &&
                    safeInstanceOf(first, 'HTMLTableCellElement') &&
                    safeInstanceOf(last, 'HTMLTableCellElement')
                ) {
                    this.vTable = new VTable(first);
                    const firstCord = getCellCoordinates(this.vTable, first);
                    const lastCord = getCellCoordinates(this.vTable, last);

                    this.vTable.selection = {
                        firstCell: firstCord,
                        lastCell: lastCord,
                    };

                    this.firstTarget = first;
                    this.lastTarget = last;
                    highlight(this.vTable);
                    this.tableRange = this.vTable.selection;
                    this.tableSelection = true;
                    this.firstTable = firstTable as HTMLTableElement;
                    this.targetTable = targetTable;
                    updateSelection(editor, first, 0);
                }
            });
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        if (!this.editor.contains(event.target as Node)) {
            return;
        }

        //If already in table selection and the new target is contained in the last target cell, no need to
        //Apply selection styles again.
        if (this.tableSelection && contains(this.lastTarget, event.target as Node, true)) {
            updateSelection(this.editor, this.firstTarget, 0);
            event.preventDefault();
            return;
        }

        if (getTagOfNode(event.target as Node) == 'TABLE') {
            event.preventDefault();
            return;
        }

        this.setData(event.target as Node);
        //Ignore if
        // Is a DIV that only contains a Table
        // If the event target is not contained in the editor.
        if (
            (this.lastTarget.lastChild == this.lastTarget.firstChild &&
                getTagOfNode(this.lastTarget.lastChild) == 'TABLE' &&
                getTagOfNode(this.lastTarget) == 'DIV') ||
            !this.editor.contains(this.lastTarget)
        ) {
            event.preventDefault();
            return;
        }

        this.prepareSelection();
        const isNewTDContainingFirstTable = safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')
            ? contains(this.lastTarget, this.firstTable)
            : false;

        if (this.firstTable! == this.targetTable! || isNewTDContainingFirstTable) {
            //When starting selection inside of a table and ends inside of the same table.
            this.selectionInsideTableMouseMove(event);
        } else if (this.tableSelection) {
            this.restoreSelection();
        }

        if (this.tableSelection) {
            updateSelection(this.editor, this.firstTarget, 0);
            event.preventDefault();
        }
    };

    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };

    private restoreSelection() {
        clearSelectedTableCells(this.editor);
        this.tableSelection = false;
        const isBeginAboveEnd = this.isAfter(this.firstTarget, this.lastTarget);
        const targetPosition = new Position(
            this.lastTarget,
            isBeginAboveEnd ? PositionType.End : PositionType.Begin
        );

        const firstTargetRange = new Range();
        if (this.firstTarget) {
            firstTargetRange.selectNodeContents(this.firstTarget);
        }
        updateSelection(
            this.editor,
            this.firstTarget,
            isBeginAboveEnd
                ? Position.getEnd(firstTargetRange).offset
                : Position.getStart(firstTargetRange).offset,
            targetPosition.element,
            targetPosition.offset
        );
    }

    private selectionInsideTableMouseMove(event: MouseEvent) {
        if (this.lastTarget != this.firstTarget) {
            updateSelection(this.editor, this.firstTarget, 0);
            if (
                this.firstTable != this.targetTable &&
                this.targetTable?.contains(this.firstTable)
            ) {
                //If selection started in a table that is inside of another table and moves to parent table
                //Make the firstTarget the TD of the parent table.
                this.firstTarget = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    this.lastTarget
                );
                (this.firstTarget as HTMLElement).querySelectorAll('table').forEach(table => {
                    const vTable = new VTable(table);
                    highlightAll(vTable);
                });
            }

            if (this.firstTable) {
                this.tableSelection = true;
                if (
                    this.vTable?.table != this.firstTable &&
                    safeInstanceOf(this.firstTarget, 'HTMLTableCellElement')
                ) {
                    this.vTable = new VTable(this.firstTarget);
                }

                this.tableRange.firstCell = getCellCoordinates(this.vTable, this.firstTarget);
                this.tableRange.lastCell = getCellCoordinates(this.vTable, this.lastTarget);
                this.vTable.selection = this.tableRange;
                highlight(this.vTable);
            }

            event.preventDefault();
        } else if (this.lastTarget == this.firstTarget && this.tableSelection) {
            this.vTable = new VTable(this.firstTable);
            this.tableRange.firstCell = getCellCoordinates(this.vTable, this.firstTarget);
            this.tableRange.lastCell = this.tableRange.firstCell;

            this.vTable.selection = this.tableRange;
            highlight(this.vTable);

            this.tableRange = this.vTable.selection;
        }
    }

    private removeMouseUpEventListener(): void {
        if (this.startedSelection) {
            this.startedSelection = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }
    //#endregion

    //#region Content Edit Features

    /**
     * When press Backspace, delete the contents inside of the selection, if it is Table Selection
     */
    DeleteTableContents: BuildInEditFeature<PluginKeyboardEvent> = {
        keys: [Keys.DELETE, Keys.BACKSPACE],
        shouldHandleEvent: (_, editor) => {
            const selection = editor.getSelectionRangeEx();
            return selection.type == SelectionRangeTypes.TableSelection;
        },
        handleEvent: (_, editor) => {
            const selection = editor.getSelectionRangeEx();
            if (selection.type == SelectionRangeTypes.TableSelection) {
                editor.addUndoSnapshot(() => {
                    editor.getSelectedRegions().forEach(region => {
                        if (safeInstanceOf(region.rootNode, 'HTMLTableCellElement')) {
                            deleteNodeContents(region.rootNode, editor);
                        }
                    });
                });
            }
        },
    };
    //#endregion

    //#region utils
    private clearTableCellSelection() {
        if (this.editor?.hasFocus()) {
            clearSelectedTableCells(this.editor);
        }
    }

    private clearState() {
        this.clearTableCellSelection();
        this.vTable = null;
        this.firstTarget = null;
        this.lastTarget = null;
        this.tableRange = {
            firstCell: null,
            lastCell: null,
        };
        this.tableSelection = false;
        this.firstTable = null;
        this.targetTable = null;
    }

    private getNextTD(event: PluginKeyDownEvent): Coordinates {
        this.lastTarget = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.lastTarget);

        if (safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')) {
            let coordinates = getCellCoordinates(this.vTable, this.lastTarget);

            if (this.tableSelection) {
                switch (event.rawEvent.which) {
                    case Keys.RIGHT:
                        coordinates.x += this.lastTarget.colSpan;
                        if (this.vTable.cells[coordinates.y][coordinates.x] == null) {
                            coordinates.x = this.vTable.cells[coordinates.y].length - 1;
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

            if (coordinates.y >= 0 && coordinates.x >= 0) {
                this.lastTarget = this.vTable.getTd(coordinates.y, coordinates.x);
            }
            return coordinates;
        }
        return null;
    }

    //Check if the selection started in a inner table.
    private prepareSelection() {
        let isNewTargetTableContained =
            this.lastTarget != this.firstTarget &&
            this.firstTable?.contains(
                findClosestElementAncestor(this.targetTable, this.firstTable, TABLE_CELL_SELECTOR)
            );

        if (isNewTargetTableContained && this.tableSelection) {
            while (isNewTargetTableContained) {
                this.lastTarget = findClosestElementAncestor(
                    this.targetTable,
                    this.firstTable,
                    TABLE_CELL_SELECTOR
                );
                this.targetTable = getTableAtCursor(this.editor, this.lastTarget);
                isNewTargetTableContained =
                    this.lastTarget != this.firstTarget &&
                    this.firstTable?.contains(
                        findClosestElementAncestor(
                            this.targetTable,
                            this.firstTable,
                            TABLE_CELL_SELECTOR
                        )
                    );
            }
        }

        let isFirstTargetTableContained =
            this.lastTarget != this.firstTarget &&
            this.targetTable?.contains(
                findClosestElementAncestor(this.firstTable, this.targetTable, TABLE_CELL_SELECTOR)
            );

        if (isFirstTargetTableContained && this.tableSelection) {
            while (isFirstTargetTableContained) {
                this.firstTarget = findClosestElementAncestor(
                    this.firstTable,
                    this.targetTable,
                    TABLE_CELL_SELECTOR
                );
                this.firstTable = this.editor.getElementAtCursor(
                    'table',
                    this.firstTarget
                ) as HTMLTableElement;
                isFirstTargetTableContained =
                    this.lastTarget != this.firstTarget &&
                    this.targetTable?.contains(
                        findClosestElementAncestor(
                            this.firstTable,
                            this.targetTable,
                            TABLE_CELL_SELECTOR
                        )
                    );
            }
        }
    }

    private setData(eventTarget: Node) {
        const pos = this.editor.getFocusedPosition();
        if (pos) {
            this.firstTarget = this.firstTarget || getCellAtCursor(this.editor, pos.node);

            if (this.firstTarget.nodeType == Node.TEXT_NODE) {
                this.firstTarget = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    this.firstTarget
                );
            }
            if (!this.editor.contains(this.firstTarget) && this.lastTarget) {
                this.firstTarget = this.lastTarget;
            }
        }

        this.firstTable = getTableAtCursor(this.editor, this.firstTarget) as HTMLTableElement;
        this.lastTarget = getCellAtCursor(this.editor, eventTarget as Node);
        this.targetTable = getTableAtCursor(this.editor, this.lastTarget);
    }

    private isAfter(node1: Node, node2: Node) {
        if (node1 && node2) {
            if (node2.contains(node1)) {
                const r1 = (node1 as Element).getBoundingClientRect?.();
                const r2 = (node2 as Element).getBoundingClientRect?.();
                if (r1 && r2) {
                    return r1.top > r2.top && r1.bottom < r2.bottom;
                }
            }

            const position = new Position(node1, PositionType.End);
            return position.isAfter(new Position(node2, PositionType.End));
        }
        return false;
    }

    // if the user selected all the text in a cell and started selecting another TD, we should convert to vSelection
    private shouldConvertToTableSelection() {
        if (!this.firstTable || !this.editor) {
            return false;
        }
        const regions = this.editor.getSelectedRegions();
        if (regions.length == 1) {
            return false;
        }

        let result = true;

        regions.forEach(value => {
            if (!contains(this.firstTable, value.rootNode)) {
                result = false;
            }
        });

        return result;
    }
    //#endregion

    //#region table selector

    private onMouseMoveSelector = (e: MouseEvent) => {
        if (e.buttons > 0) {
            return;
        }

        this.ensureTableRects();
        const { pageX: x, pageY: y } = e;
        let currentTable: HTMLTableElement | null = null;

        for (let i = this.tableRectMap.length - 1; i >= 0; i--) {
            const { table, rect } = this.tableRectMap[i];

            if (
                x >= rect.left - TABLE_SELECTOR_LENGTH &&
                x <= rect.right + TABLE_SELECTOR_LENGTH &&
                y >= rect.top - TABLE_SELECTOR_LENGTH &&
                y <= rect.bottom + TABLE_SELECTOR_LENGTH
            ) {
                currentTable = table;
                break;
            }
        }

        this.setTableSelector(currentTable);
    };

    private setTableSelector(table: HTMLTableElement) {
        if (this.editor) {
            if (this.tableSelector && table != this.tableSelector.table) {
                this.tableSelector.dispose();
                this.tableSelector = null;
            }

            if (!this.tableSelector && table) {
                this.tableSelector = new TableSelector(
                    this.editor,
                    table,
                    this.invalidateTableRects
                );
            }
        }
    }

    private invalidateTableRects = () => {
        this.tableRectMap = null;
    };

    private ensureTableRects() {
        if (!this.tableRectMap) {
            this.tableRectMap = [];
            this.editor.queryElements('table', table => {
                if (table.isContentEditable) {
                    const rect = normalizeRect(table.getBoundingClientRect());
                    if (rect) {
                        this.tableRectMap.push({
                            table,
                            rect,
                        });
                    }
                }
            });
        }
    }
    //#endregion
}

function deleteNodeContents(element: HTMLElement, editor: IEditor) {
    const range = new Range();
    range.selectNodeContents(element);
    range.deleteContents();
    element.appendChild(editor.getDocument().createElement('br'));
}

function updateSelection(
    editor: IEditor,
    start: Node,
    offset: number,
    end?: Node,
    endOffset?: number
) {
    const selection = editor.getDocument().defaultView.getSelection();
    end = end || start;
    endOffset = endOffset || offset;
    selection.setBaseAndExtent(start, offset, end, endOffset);
}

function getCellAtCursor(editor: IEditor, node: Node) {
    if (editor) {
        return editor.getElementAtCursor(TABLE_CELL_SELECTOR, node) || (node as HTMLElement);
    }
    return node as HTMLElement;
}

function getTableAtCursor(editor: IEditor, node: Node) {
    if (editor) {
        return editor.getElementAtCursor('table', node);
    }
    return null;
}
