import normalizeTableSelection from './utils/normalizeTableSelection';
import { getCellCoordinates } from './utils/getCellCoordinates';
import { removeCellsOutsideSelection } from './utils/removeCellsOutsideSelection';
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
    SelectionRangeTypes,
    TableOperation,
    TableSelection,
} from 'roosterjs-editor-types';
import {
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    VTable,
    Position,
    contains,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = 'td,th';
const LEFT_CLICK = 1;
const RIGHT_CLICK = 3;
const IGNORE_KEY_UP_KEYS = [
    Keys.SHIFT,
    Keys.ALT,
    Keys.META_LEFT,
    Keys.CTRL_LEFT,
    Keys.PRINT_SCREEN,
];
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
    private preventKeyUp: boolean;

    constructor() {
        this.lastTarget = null;
        this.firstTarget = null;
        this.tableSelection = false;
        this.tableRange = {
            firstCell: null,
            lastCell: null,
        };
        this.startedSelection = false;
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
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor.select(null);
        this.removeMouseUpEventListener();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.EnteredShadowEdit:
                    const selection = this.editor.getSelectionRangeEx();
                    if (selection.type == SelectionRangeTypes.TableSelection) {
                        this.tableRange = selection.coordinates;
                        this.firstTable = selection.table;
                        this.tableSelection = true;
                        this.editor.select(selection.table, null);
                    }
                    break;
                case PluginEventType.LeavingShadowEdit:
                    if (this.firstTable && this.tableSelection && this.tableRange) {
                        const table = this.editor.queryElements('#' + this.firstTable.id);
                        if (table.length == 1) {
                            this.firstTable = table[0] as HTMLTableElement;
                            this.editor.select(this.firstTable, this.tableRange);
                        }
                    }
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
                case PluginEventType.Scroll:
                    if (this.startedSelection) {
                        this.handleScrollEvent();
                    }
                    break;
                case PluginEventType.BeforeSetContent:
                    if (this.tableRange) {
                        this.tableRange = null;
                        this.firstTable = null;
                        this.tableSelection = false;
                        this.editor.select(null);
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
                this.selectTable();
                this.tableRange.lastCell = this.vTable.selection.lastCell;
                updateSelection(this.editor, this.firstTarget, 0);
            }
        } else if (this.tableSelection) {
            this.restoreSelection();
        }
    }

    /**
     * Handles the Before Copy Event.
     * Clear the selection range from the cloned Root.
     * @param event plugin event
     */
    private handleBeforeCutCopy(event: BeforeCutCopyEvent) {
        const selection = this.editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.TableSelection) {
            const clonedTable = event.clonedRoot.querySelector('table#' + selection.table.id);
            if (clonedTable) {
                this.tableRange = selection.coordinates;
                const clonedVTable = new VTable(clonedTable as HTMLTableElement);
                clonedVTable.selection = this.tableRange;
                removeCellsOutsideSelection(clonedVTable);
                clonedVTable.writeBack();
                event.range.selectNode(clonedTable);
                if (event.isCut) {
                    this.deleteTableColumns(selection.table, selection.coordinates);
                }
            }
        }
    }

    private deleteTableColumns(table: HTMLTableElement, selection: TableSelection) {
        const isWholeColumnSelection =
            table.rows.length - 1 === selection.lastCell.y && selection.firstCell.y === 0;
        if (isWholeColumnSelection) {
            const selectedVTable = new VTable(table);
            selectedVTable.selection = selection;
            selectedVTable.edit(TableOperation.DeleteColumn);
            selectedVTable.writeBack();
            this.editor.select(selectedVTable.table, PositionType.After);
        }
    }

    //#region Key events
    /**
     * Handles the on key event.
     * @param event the plugin event
     */
    private handleKeyDownEvent(event: PluginKeyDownEvent) {
        const { shiftKey, ctrlKey, metaKey, which, defaultPrevented } = event.rawEvent;
        if ((shiftKey && (ctrlKey || metaKey)) || which == Keys.SHIFT || defaultPrevented) {
            this.preventKeyUp = defaultPrevented;
            return;
        }

        if (shiftKey) {
            if (!this.firstTarget) {
                const pos = this.editor.getFocusedPosition();
                const cell = pos && getCellAtCursor(this.editor, pos.node);

                this.firstTarget = this.firstTarget || cell;
            }

            //If first target is not a table cell, we should ignore this plugin
            if (!safeInstanceOf(this.firstTarget, 'HTMLTableCellElement')) {
                return;
            }
            this.editor.runAsync(editor => {
                const pos = editor.getFocusedPosition();
                const newTarget = this.tableSelection ? this.lastTarget : pos?.node;
                if (newTarget) {
                    this.setData(newTarget);
                }

                if (this.firstTable! == this.targetTable!) {
                    if (!this.shouldConvertToTableSelection() && !this.tableSelection) {
                        return;
                    }
                    //When selection start and end is inside of the same table
                    this.handleKeySelectionInsideTable(event);
                } else if (this.tableSelection) {
                    if (this.firstTable) {
                        this.editor.select(this.firstTable, null);
                    }
                    this.tableSelection = false;
                }
            });
        }
    }

    private handleKeyUpEvent(event: PluginKeyUpEvent) {
        const { shiftKey, which, ctrlKey } = event.rawEvent;
        if (
            !shiftKey &&
            !ctrlKey &&
            this.firstTarget &&
            !this.preventKeyUp &&
            IGNORE_KEY_UP_KEYS.indexOf(which) == -1
        ) {
            this.clearState();
        }
        this.preventKeyUp = false;
    }

    private handleKeySelectionInsideTable(event: PluginKeyDownEvent) {
        this.firstTarget = getCellAtCursor(this.editor, this.firstTarget);
        this.lastTarget = getCellAtCursor(this.editor, this.lastTarget);

        updateSelection(this.editor, this.firstTarget, 0);
        this.vTable = this.vTable || new VTable(this.firstTable as HTMLTableElement);
        this.tableRange = {
            firstCell: getCellCoordinates(this.vTable, this.firstTarget as Element),
            lastCell: this.getNextTD(event),
        };

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
                this.editor.select(sel.getRangeAt(0));
                sel.setBaseAndExtent(anchorNode, anchorOffset, position.node, position.offset);
                this.lastTarget = position.node;
                event.rawEvent.preventDefault();
                return;
            }
        }

        this.vTable.selection = this.tableRange;
        this.selectTable();

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
            const coord = getCellCoordinates(this.vTable, td);
            if (coord) {
                const { firstCell, lastCell } = normalizeTableSelection(this.vTable);
                if (
                    coord.y >= firstCell.y &&
                    coord.y <= lastCell.y &&
                    coord.x >= firstCell.x &&
                    coord.x <= lastCell.x
                ) {
                    this.firstTarget = this.vTable.getCell(firstCell.y, firstCell.x).td;
                    this.lastTarget = this.vTable.getCell(lastCell.y, lastCell.x).td;

                    if (this.firstTarget && this.lastTarget) {
                        const selection = this.editor.getDocument().defaultView.getSelection();
                        selection.setBaseAndExtent(this.firstTarget, 0, this.lastTarget, 0);
                        this.selectTable();
                    }

                    return;
                }
            }
        }
        if (which == LEFT_CLICK && !shiftKey) {
            this.clearState();

            if (getTableAtCursor(this.editor, event.rawEvent.target)) {
                this.editor
                    .getDocument()
                    .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
                this.editor
                    .getDocument()
                    .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
                this.startedSelection = true;
            }
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
                    this.selectTable();

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

        // If there is a first target, but is not inside a table, no more actions to perform.
        if (this.firstTarget && !this.firstTable) {
            return;
        }

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

        if (
            (this.firstTable && this.firstTable == this.targetTable) ||
            isNewTDContainingFirstTable
        ) {
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
        if (this.firstTable) {
            this.editor.select(this.firstTable, null);
        }
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

    /**
     * @internal
     * Public only for unit testing
     * @param event mouse event
     */
    selectionInsideTableMouseMove(event: MouseEvent) {
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
            }

            if (this.firstTable) {
                this.tableSelection = true;

                this.vTable = this.vTable || new VTable(this.firstTable);
                this.tableRange = {
                    firstCell: getCellCoordinates(this.vTable, this.firstTarget),
                    lastCell: getCellCoordinates(this.vTable, this.lastTarget),
                };
                this.vTable.selection = this.tableRange;
                this.selectTable();
            }

            event.preventDefault();
        } else if (this.lastTarget == this.firstTarget && this.tableSelection) {
            this.vTable = new VTable(this.firstTable);
            const cell = getCellCoordinates(this.vTable, this.firstTarget);
            this.tableRange = {
                firstCell: cell,
                lastCell: cell,
            };

            this.vTable.selection = this.tableRange;
            this.selectTable();
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
    private clearState() {
        this.editor.select(null);
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

    selectTable() {
        if (this.editor && this.vTable) {
            this.editor?.select(this.vTable.table, normalizeTableSelection(this.vTable));
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

function getTableAtCursor(editor: IEditor, node: Node | EventTarget) {
    if (editor) {
        return editor.getElementAtCursor('table', node as Node);
    }
    return null;
}
