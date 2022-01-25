import {
    BeforeCutCopyEvent,
    BuildInEditFeature,
    ContentPosition,
    Coordinates,
    EditorPlugin,
    IEditor,
    Keys,
    KnownCreateElementDataIndex,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PluginMouseUpEvent,
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
    createElement,
    queryElements,
    Position,
    contains,
    isBlockElement,
    normalizeRect,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = 'td,th';
const TABLE_SELECTED = '_tableSelected';
const TABLE_CELL_SELECTED = '_tableCellSelected';
const TABLE_SELECTOR_ID = 'tableSelector';
const TABLE_SELECTOR_LENGTH = 12;
const LEFT_CLICK = 1;
const RIGHT_CLICK = 3;

/**
 * TableSelectionPlugin help highlight table cells
 */
export default class TableCellSelectionPlugin implements EditorPlugin {
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

    // Range used in all the class
    private range: Range;

    // Properties used for the table selector in the Top left corner
    private wholeTableSelectorContainer: HTMLDivElement;
    private tableSelector: HTMLDivElement;
    private lastTableHover: HTMLElement;
    private lastTableHoverRect: Rect;
    private onMouseMoveDisposer: () => void;

    constructor(private contentDiv: HTMLDivElement) {
        this.lastTarget = null;
        this.firstTarget = null;
        this.tableSelection = false;
        this.tableRange = null;
        this.startedSelection = false;
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.setupSelectorContainer();
        this.onMouseMoveDisposer = this.editor.addDomEventHandler({
            mousemove: this.tableSelectorEvent,
        });
        this.editor.addContentEditFeature(this.DeleteTableContents);
        this.editor.addContentEditFeature(this.DeleteTableStructure);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.removeMouseUpEventListener();
        this.removeSelectorContainer();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            this.range = this.editor.getSelectionRange();
            switch (event.eventType) {
                case PluginEventType.ExtractContentWithDom:
                    clearSelectedTableCells(event.clonedRoot);
                    break;
                case PluginEventType.BeforeCutCopy:
                    this.handleBeforeCutCopy(event);
                    break;
                case PluginEventType.MouseUp:
                    this.handleMouseUpEvent(event);
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
                        event.rawEvent.preventDefault();
                    }
                    break;
            }
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

            clonedVTable.removeCellsBySelection();
            clonedVTable.writeBack();

            event.range.selectNode(clonedTable);

            if (event.isCut) {
                this.vTable.forEachSelectedCell(cell => {
                    if (cell?.td) {
                        const deleteRange = new Range();
                        deleteRange.selectNodeContents(cell.td);
                        deleteRange.deleteContents();
                        cell.td.appendChild(this.editor.getDocument().createElement('BR'));
                    }
                });
            }
        }
        clearSelectedTableCells(event.clonedRoot);
    }

    //#region Key events
    /**
     * Handles the on key event.
     * @param event the plugin event
     */
    private handleKeyDownEvent(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        const { shiftKey, ctrlKey, metaKey, which } = event.rawEvent;
        if ((shiftKey && (ctrlKey || metaKey)) || which == Keys.SHIFT) {
            return;
        }

        const pos = this.editor.getFocusedPosition();
        this.firstTarget = this.firstTarget || pos.node;
        this.editor.runAsync(editor => {
            const pos = editor.getFocusedPosition();
            this.setData(this.tableSelection ? this.lastTarget : pos.node);

            if (shiftKey && event.eventType == PluginEventType.KeyDown) {
                const commonAncestorContainer = this.range.commonAncestorContainer;
                const ancestorTag = getTagOfNode(commonAncestorContainer);

                if (
                    (!this.tableSelection &&
                        !isBlockElement(commonAncestorContainer) &&
                        editor.getElementAtCursor(TABLE_CELL_SELECTOR, commonAncestorContainer)) ||
                    (!this.tableSelection && ancestorTag == 'TD' && !this.range.collapsed)
                ) {
                    return;
                }
                if (this.firstTable! == this.targetTable!) {
                    const range = editor.getSelectionRange();
                    if (!shouldConvertToTableSelection(range) && !this.tableSelection) {
                        return;
                    }

                    //When selection start and end is inside of the same table
                    this.handleKeySelectionInsideTable(event);
                } else if (this.tableSelection) {
                    clearSelectedTableCells(this.contentDiv);
                    this.tableSelection = false;
                }
            }
        });
    }

    private handleKeyUpEvent(event: PluginKeyUpEvent) {
        const { shiftKey, which } = event.rawEvent;
        if (!shiftKey && which != Keys.SHIFT) {
            this.clearState();
        }
    }

    private handleKeySelectionInsideTable(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        updateSelection(this.editor, this.firstTarget, 0);
        this.vTable = this.vTable || new VTable(this.firstTable as HTMLTableElement);
        this.tableRange.firstCell = this.vTable.getCellCoordinates(this.firstTarget as Element);
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

        this.vTable.highlightSelection(this.tableRange);

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
                this.vTable.highlight();
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
    }

    private handleMouseUpEvent(event: PluginMouseUpEvent) {
        if (
            event.isClicking &&
            this.range.collapsed &&
            !this.tableSelection &&
            event.rawEvent.which != RIGHT_CLICK
        ) {
            this.clearTableCellSelection();
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        if (event.currentTarget == this.contentDiv) {
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
            !this.contentDiv.contains(this.lastTarget)
        ) {
            event.preventDefault();
            return;
        }

        this.prepareSelection();

        const targetIsValid = this.targetTable == this.firstTable;
        const isNewTDContainingFirstTable = safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')
            ? contains(this.lastTarget, this.firstTable)
            : false;

        if (this.firstTable && (targetIsValid || isNewTDContainingFirstTable)) {
            //When starting selection inside of a table and ends inside of the same table.
            this.selectionInsideTableMouseMove(event);
        } else if (this.tableSelection) {
            clearSelectedTableCells(this.contentDiv);
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

        if (this.tableSelection) {
            updateSelection(this.editor, this.firstTarget, 0);
            event.preventDefault();
        }
    };

    // If selection  started outside of a table or moves outside of the first table and finishes inside of a different table,
    // selects all the row in the table where it started and where it finished
    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };

    private selectionInsideTableMouseMove(event: MouseEvent) {
        let eventTarget = this.lastTarget;
        const firstTableTD = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.firstTarget);

        if (this.firstTarget && eventTarget && this.lastTarget && eventTarget != this.firstTarget) {
            if (!this.tableSelection && !shouldConvertToTableSelection(this.range)) {
                return;
            } else {
                updateSelection(this.editor, this.firstTarget, 0);
                if (
                    this.firstTable != this.targetTable &&
                    this.targetTable?.contains(this.firstTable)
                ) {
                    //If selection started in a table that is inside of another table and moves to parent table
                    //Make the firstTarget the TD of the parent table.
                    this.firstTarget = this.editor.getElementAtCursor(
                        TABLE_CELL_SELECTOR,
                        eventTarget
                    );
                    (this.firstTarget as HTMLElement).querySelectorAll('table').forEach(table => {
                        const vTable = new VTable(table);
                        vTable.highlightAll();
                    });
                }
            }

            const currentTargetTD = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR,
                eventTarget
            ) as HTMLTableCellElement;

            if (this.firstTable && currentTargetTD) {
                this.tableSelection = true;
                if (
                    this.vTable?.table != this.firstTable &&
                    safeInstanceOf(firstTableTD, 'HTMLTableCellElement')
                ) {
                    this.vTable = new VTable(firstTableTD);
                }

                this.tableRange.firstCell = this.vTable.getCellCoordinates(firstTableTD);
                this.tableRange.lastCell = this.vTable.getCellCoordinates(
                    currentTargetTD ?? firstTableTD
                );
                this.vTable.highlightSelection(this.tableRange);
            }

            event.preventDefault();
        } else if (eventTarget == this.firstTarget && this.tableSelection) {
            this.vTable = new VTable(this.firstTable);
            this.tableRange.firstCell = this.vTable.getCellCoordinates(firstTableTD);
            this.tableRange.lastCell = this.tableRange.firstCell;

            this.vTable.highlightSelection(this.tableRange);

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

    //#region Table selector
    /**
     * Sets the table selector when hovering a table
     * @param event Mouse Event
     */
    private tableSelectorEvent = (event: MouseEvent) => {
        if (this.startedSelection) {
            return;
        }
        const eventTarget = event.target as HTMLElement;
        const table = getTableAtCursor(this.editor, eventTarget);

        if (!this.lastTableHover || this.lastTableHover.contains(table)) {
            this.lastTableHover = this.lastTableHover != table ? table : this.lastTableHover;
        }
        if (this.tableSelector) {
            if (
                this.lastTableHover &&
                this.lastTableHoverRect &&
                (this.lastTableHoverRect.left - event.pageX + 3 > TABLE_SELECTOR_LENGTH ||
                    this.lastTableHoverRect.top - event.pageY > TABLE_SELECTOR_LENGTH ||
                    event.pageX - this.lastTableHoverRect.right > TABLE_SELECTOR_LENGTH ||
                    event.pageY - this.lastTableHoverRect.bottom > TABLE_SELECTOR_LENGTH)
            ) {
                if (table) {
                    this.lastTableHover =
                        this.lastTableHover != table ? table : this.lastTableHover;
                } else if (eventTarget.id != TABLE_SELECTOR_ID) {
                    if (this.tableSelector) {
                        this.tableSelector.style.display = 'none';
                    }

                    this.lastTableHoverRect = null;
                    this.lastTableHover = null;
                }
            }
        }

        if (this.lastTableHover) {
            this.createTableSelector();
            this.wholeTableSelectorContainer.appendChild(this.tableSelector);
        }
    };

    /**
     * Creates the container that is going to store the table selector
     */
    private setupSelectorContainer(): void {
        const document = this.editor.getDocument();
        this.wholeTableSelectorContainer = document.createElement('div');
        this.editor?.insertNode(this.wholeTableSelectorContainer, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });
    }

    private removeSelectorContainer(): void {
        this.wholeTableSelectorContainer?.parentNode?.removeChild(this.wholeTableSelectorContainer);
        this.wholeTableSelectorContainer = null;
    }

    private createTableSelector(): void {
        this.lastTableHoverRect = normalizeRect(this.lastTableHover.getBoundingClientRect());
        if (!this.lastTableHover || !this.lastTableHoverRect) {
            this.tableSelector.style.display = 'none';
            this.lastTableHoverRect = null;
            this.lastTableHover = null;
            return;
        }
        if (!this.tableSelector) {
            this.tableSelector = createElement(
                KnownCreateElementDataIndex.TableSelector,
                this.editor.getDocument()
            ) as HTMLDivElement;

            this.tableSelector.id = TABLE_SELECTOR_ID;
            this.tableSelector.style.width = `${TABLE_SELECTOR_LENGTH}px`;
            this.tableSelector.style.height = `${TABLE_SELECTOR_LENGTH}px`;

            this.tableSelector.addEventListener('click', (ev: MouseEvent) => {
                const vTable = new VTable(this.lastTableHover as HTMLTableElement);
                if (vTable) {
                    clearSelectedTableCells(this.contentDiv);
                    queryElements(this.lastTableHover, TABLE_CELL_SELECTOR, node => {
                        this.lastTarget = node;
                    });

                    this.editor.focus();
                    this.range = new Range();
                    this.range.selectNodeContents(this.lastTarget);
                    this.range.collapse();
                    this.editor.select(this.range);

                    vTable.highlightAll();
                    this.tableRange = vTable.selection;
                    const { firstCell, lastCell } = this.tableRange;
                    this.firstTarget = vTable.cells[firstCell.y][firstCell.x].td;
                    this.lastTarget = vTable.cells[lastCell.y][lastCell.x].td;
                    this.tableSelection = true;
                    this.vTable = vTable;

                    this.editor.triggerPluginEvent(
                        PluginEventType.MouseUp,
                        {
                            rawEvent: ev,
                        },
                        false
                    );
                }
            });
        }

        this.tableSelector.style.top = `${this.lastTableHoverRect.top - TABLE_SELECTOR_LENGTH}px`;
        this.tableSelector.style.left = `${
            this.lastTableHoverRect.left - TABLE_SELECTOR_LENGTH - 2
        }px`;
        this.tableSelector.style.display = 'unset';
    }

    //#endregion

    //#region Content Edit Features

    /**
     * When press Backspace, delete the contents inside of the selection, if it is vSelection
     */
    DeleteTableContents: BuildInEditFeature<PluginKeyboardEvent> = {
        keys: [Keys.DELETE],
        shouldHandleEvent: (event, editor) => {
            const selection = editor.getSelectionRangeEx();
            return selection.type == SelectionRangeTypes.TableSelection;
        },
        handleEvent: (event, editor) => {
            const selection = editor.getSelectionRangeEx();
            if (selection.type == SelectionRangeTypes.TableSelection && selection.vTable) {
                editor.addUndoSnapshot(() => {
                    selection.vTable.forEachSelectedCell(cell => {
                        if (cell.td) {
                            const range = new Range();
                            range.selectNodeContents(cell.td);
                            range.deleteContents();
                            cell.td.appendChild(editor.getDocument().createElement('br'));
                        }
                    });
                });
            }
        },
    };

    /**
     * When press Delete, delete the Table cells selected if it is vSelection
     */
    DeleteTableStructure: BuildInEditFeature<PluginKeyboardEvent> = {
        keys: [Keys.BACKSPACE],
        shouldHandleEvent: (event, editor) => {
            const selection = editor.getSelectionRangeEx();
            return selection.type == SelectionRangeTypes.TableSelection;
        },
        handleEvent: (event, editor) => {
            const selection = editor.getSelectionRangeEx();
            if (selection.type == SelectionRangeTypes.TableSelection && selection.vTable) {
                const vTable = selection.vTable;
                vTable.removeCellsBySelection(false);
                vTable.writeBack();
            }
        },
    };
    //#endregion

    //#region utils
    private clearTableCellSelection() {
        if (this.editor?.hasFocus()) {
            clearSelectedTableCells(this.contentDiv);
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

    private getNextTD(event: PluginKeyDownEvent | PluginKeyUpEvent): Coordinates {
        this.lastTarget = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.lastTarget);

        if (safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')) {
            let coordinates = this.vTable.getCellCoordinates(this.lastTarget);

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
        this.range = this.editor.getSelectionRange();
        if (pos) {
            this.firstTarget = this.firstTarget || getCellAtCursor(this.editor, pos.node);

            if (this.firstTarget.nodeType == Node.TEXT_NODE) {
                this.firstTarget = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    this.firstTarget
                );
            }
            if (this.firstTarget == this.contentDiv && this.lastTarget) {
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
    //#endregion
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

// if the user selected all the text in a cell and started selecting another TD, we should convert to vSelection
function shouldConvertToTableSelection(range: Range) {
    return (
        getTagOfNode(range.commonAncestorContainer) == 'TBODY' ||
        getTagOfNode(range.commonAncestorContainer) == 'TR'
    );
}

/**
 * Remove the selected style of the cells
 * @param container the container to get the cells from
 */
function clearSelectedTableCells(container: Node) {
    const tables = getSelectedTables(container);

    if (tables) {
        tables.forEach(element => {
            if (safeInstanceOf(element, 'HTMLTableElement')) {
                const vTable = new VTable(element);
                vTable.deSelectAll();
            }
        });
    }
}

/**
 * Get the cells with the selected cells class
 * @param container the container to get the cells from
 * @returns Array of Nodes with selected class
 */
function getSelectedTables(container: Node) {
    if (container && safeInstanceOf(container, 'HTMLElement')) {
        let result = container.querySelectorAll('table');
        if (result.length == 0) {
            let table = findClosestElementAncestor(container, null, 'table');
            if (table && table.querySelectorAll('.' + TABLE_CELL_SELECTED).length > 0) {
                return [table];
            }
        }

        return result;
    }
}
