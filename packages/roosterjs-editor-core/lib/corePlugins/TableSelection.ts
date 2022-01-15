import {
    BeforeCutCopyEvent,
    ContentPosition,
    IEditor,
    Keys,
    KnownCreateElementDataIndex,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PluginMouseUpEvent,
    PluginWithState,
    PositionType,
    Rect,
    TableSelectionPluginState,
} from 'roosterjs-editor-types';
import {
    clearSelectedTableCells,
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    TableMetadata,
    VTable,
    createElement,
    normalizeRect,
    queryElements,
    Browser,
    Position,
    contains,
    isVoidHtmlElement,
    isBlockElement,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = TableMetadata.TABLE_CELL_SELECTOR;
const TABLE_SELECTOR_ID = 'tableSelector';
const TABLE_SELECTOR_LENGTH = 12;
/**
 * @internal
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements PluginWithState<TableSelectionPluginState> {
    // State property
    private state: TableSelectionPluginState;

    private editor: IEditor;

    // Stores the current VTable, only used when the selection starts inside of a table.
    private vTable: VTable;
    private firstTable: HTMLTableElement;
    private targetTable: HTMLElement;

    // Stores all tables in the current contentDiv, used when selection starts outside of table
    // Or moves outside of a table
    private cachedTables: VTable[];

    // Range used in all the class
    private range: Range;

    // Properties used for the table selector in the Top left corner
    private wholeTableSelectorContainer: HTMLDivElement;
    private tableSelector: HTMLDivElement;
    private lastTableHover: HTMLElement;
    private lastTableHoverRect: Rect;
    private onMouseMoveDisposer: () => void;

    constructor(private contentDiv: HTMLDivElement) {
        this.state = {
            lastTarget: null,
            firstTarget: null,
            vSelection: false,
            startRange: [],
            endRange: [],
            startedSelection: false,
        };
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

    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            this.cacheTables();
            this.range = this.editor.getSelectionRange();

            switch (event.eventType) {
                case PluginEventType.ExtractContentWithDom:
                    clearSelectedTableCells(event.clonedRoot);
                    break;
                case PluginEventType.MouseUp:
                    this.handleMouseUp(event);
                    break;
                case PluginEventType.BeforeCutCopy:
                    this.handleBeforeCutCopy(event);
                    break;
                case PluginEventType.MouseDown:
                    if (!this.state.startedSelection) {
                        this.handleMouseDown(event);
                    }
                    break;
                case PluginEventType.KeyDown:
                    if (!this.state.startedSelection) {
                        this.handleKeyEvent(event);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.KeyUp:
                    if (!this.state.startedSelection) {
                        this.handleKeyUp(event);
                    } else {
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
        if (event.vTableSelection) {
            const clonedTable = event.clonedRoot.querySelector('table');

            const clonedVTable = new VTable(clonedTable);
            clonedVTable.startRange = event.vTableStartRange;
            clonedVTable.endRange = event.vTableEndRange;

            clonedVTable.removeCellsBySelection();
            clonedVTable.writeBack();

            event.range.setStart(clonedTable.parentNode, 0);
            event.range.setEndAfter(clonedTable);

            if (event.isCut) {
                this.vTable.forEachSelectedCell(cell => {
                    if (cell?.td) {
                        const deleteRange = new Range();
                        deleteRange.selectNodeContents(cell.td);
                        deleteRange.deleteContents();
                        cell.td.appendChild(this.editor.getDocument().createElement('BR'));
                    }
                });

                this.clearState();
            }
        }
        clearSelectedTableCells(event.clonedRoot);
    }

    //#region Key events
    /**
     * Handles the on key event.
     * @param event the plugin event
     */
    private handleKeyEvent(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        if (
            (event.rawEvent.ctrlKey || event.rawEvent.metaKey) &&
            !(event.rawEvent.shiftKey && (event.rawEvent.ctrlKey || event.rawEvent.metaKey))
        ) {
            return;
        }
        const selection = this.editor.getDocument().defaultView.getSelection();
        const { anchorNode } = selection;
        this.range = this.editor.getSelectionRange();

        this.state.firstTarget = this.state.firstTarget || anchorNode;
        let forceSelection = false;
        if (getTagOfNode(this.state.firstTarget) == 'TR' && this.range) {
            this.state.firstTarget = anchorNode;
        }

        //If the selection started in a text node inside of a table cell and the selection moves to the next cell
        if (
            this.range &&
            !this.range.collapsed &&
            getTagOfNode(this.range.commonAncestorContainer) == 'TR' &&
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, anchorNode)
        ) {
            const newPos = new Position(
                this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, anchorNode),
                PositionType.Begin
            );
            updateSelection(this.editor, newPos.element, newPos.offset);
            if (this.state.firstTarget.nodeType == Node.TEXT_NODE) {
                this.state.firstTarget = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    this.state.firstTarget
                );
            }
            forceSelection = true;
        }

        if (
            (event.rawEvent.shiftKey && event.eventType == PluginEventType.KeyDown) ||
            forceSelection
        ) {
            // if (event.rawEvent.which == Keys.SHIFT) {
            //     return;
            // }

            // this.range = this.editor.getSelectionRange();
            // const pos = this.editor.getFocusedPosition();
            // this.state.lastTarget = pos.element ?? this.state.firstTarget;
            // this.setData();
            // if (
            //     ((this.range.commonAncestorContainer.nodeType == Node.TEXT_NODE ||
            //         !isCell(this.range.commonAncestorContainer)) &&
            //         this.editor.getElementAtCursor(
            //             TABLE_CELL_SELECTOR,
            //             this.range.commonAncestorContainer
            //         )) ||
            //     (!isCell(this.range.commonAncestorContainer) &&
            //         !forceSelection &&
            //         !this.range.collapsed)
            // ) {
            //     return;
            // }
            // if (isCell(this.range.commonAncestorContainer) || !isCell(this.state.lastTarget)) {
            //     if (
            //         this.firstTable &&
            //         this.targetTable &&
            //         this.firstTable == this.targetTable &&
            //         this.shouldConvertToVSelection()
            //     ) {
            //         //When selection start and end is inside of the same table
            //         this.handleKeySelectionInsideTable(event);
            //     }
            // } else {
            //     this.editor.runAsync(() => {
            //         this.handleKeySelectionOutsideTable(event);
            //     });
            // }
            if (event.rawEvent.which == Keys.SHIFT) {
                return;
            }

            if (
                (!isBlockElement(this.range.commonAncestorContainer) &&
                    this.editor.getElementAtCursor(
                        TABLE_CELL_SELECTOR,
                        this.range.commonAncestorContainer
                    )) ||
                (getTagOfNode(this.range.commonAncestorContainer) == 'TD' &&
                    !forceSelection &&
                    !this.range.collapsed)
            ) {
                return;
            }
            this.state.lastTarget = this.state.lastTarget ?? this.state.firstTarget;
            this.setData();
            if (this.firstTable && this.targetTable && this.firstTable == this.targetTable) {
                //When selection start and end is inside of the same table
                this.handleKeySelectionInsideTable(event);
            } else {
                this.editor.runAsync(() => {
                    this.handleKeySelectionOutsideTable(event);
                });
            }
        }
    }

    private handleKeyUp(event: PluginKeyUpEvent) {
        if (
            this.range &&
            this.range.collapsed &&
            !this.state.vSelection &&
            !this.range.collapsed &&
            isCell(this.range.commonAncestorContainer)
        ) {
            //If the selection is not collapsed, verify what tables are inside of the range, and highlight the tables.
            this.state.firstTarget = this.range.startContainer;
            const eventTarget = this.range.endContainer;
            this.state.lastTarget = eventTarget;
            this.handleSelectionOutsideOfTable(eventTarget);
            return;
        }

        if (!event.rawEvent.shiftKey && event.rawEvent.which != Keys.SHIFT) {
            this.clearState();
        }
    }

    private handleKeySelectionInsideTable(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        let firstTable = this.firstTable;
        let targetTable = this.targetTable;
        if (!this.range.collapsed) {
            this.state.lastTarget = this.range.endContainer;
            updateSelection(this.editor, this.state.firstTarget, 0);
        }

        this.vTable = new VTable(firstTable as HTMLTableElement);
        if (this.state.firstTarget.nodeType == Node.TEXT_NODE) {
            this.state.firstTarget = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR,
                this.state.firstTarget
            );
        }
        this.state.startRange = this.vTable.getCellCoordinates(this.state.firstTarget as Element);
        this.state.endRange = this.getNextTD(event);

        if (
            !this.state.endRange ||
            this.state.endRange[1] > this.vTable.cells.length - 1 ||
            this.state.endRange[1] == -1
        ) {
            //When selection is moving from inside of a table to outside
            let eventTarget = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR + ',div',
                firstTable
            );
            if (safeInstanceOf(eventTarget, 'HTMLTableCellElement')) {
                targetTable = this.editor.getElementAtCursor('table', eventTarget);
                ({ eventTarget, firstTable, targetTable } = this.prepareSelection(
                    eventTarget,
                    firstTable,
                    targetTable
                ));
            } else {
                const position = new Position(
                    this.targetTable,
                    this.state.endRange == null || this.state.endRange[1] == -1
                        ? PositionType.Before
                        : PositionType.After
                );

                this.highlightSelection(
                    this.state.lastTarget,
                    this.editor.getElementAtCursor('table', this.state.lastTarget),
                    false
                );
                this.state.lastTarget = position.node;

                const sel = this.editor.getDocument().defaultView.getSelection();
                const { anchorNode, anchorOffset } = sel;
                sel.setBaseAndExtent(anchorNode, anchorOffset, position.node, position.offset);
                this.selectAllRow();
                event.rawEvent.preventDefault();
                return;
            }
        }

        this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

        this.state.vSelection = true;
        event.rawEvent.preventDefault();
    }

    private handleKeySelectionOutsideTable(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        this.setData();
        let pos = this.editor.getFocusedPosition();
        let firstTd = pos && this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, pos.node);
        let td =
            firstTd && (getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement));
        const selection = this.editor.getDocument().defaultView?.getSelection();
        let { anchorNode, anchorOffset } = selection;

        if (td && safeInstanceOf(selection.focusNode, 'HTMLTableRowElement')) {
            td = selection.focusNode.cells[selection.focusOffset - 1];
        }
        const isStartAboveEnd = this.isAfter(td, this.state.firstTarget);
        if (td) {
            const tr = td.parentNode as HTMLTableRowElement;
            const vtable = new VTable(td);
            const isUp = event.rawEvent.which == Keys.UP || event.rawEvent.which == Keys.LEFT;
            const step = isUp ? -1 : 1;
            let targetTd: HTMLTableCellElement = null;

            if (selection) {
                if (tr.cells.item(isStartAboveEnd ? 0 : tr.cells.length - 1) == td) {
                    targetTd = tr.cells.item(!isStartAboveEnd ? 0 : tr.cells.length - 1);
                } else {
                    for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
                        let cell = vtable.getCell(row, vtable.col);
                        if (cell.td && cell.td != td) {
                            targetTd = cell.td;
                            break;
                        }
                    }
                }

                this.editor.runAsync(editor => {
                    let newContainer = editor.getElementAtCursor();

                    newContainer = isStartAboveEnd ? tr.cells[tr.cells.length - 1] : tr.cells[0];
                    if (
                        contains(vtable.table, newContainer) &&
                        !contains(td, newContainer, true /*treatSameNodeAsContain*/)
                    ) {
                        let newPos = targetTd
                            ? new Position(targetTd, isUp ? PositionType.Begin : PositionType.End)
                            : new Position(
                                  vtable.table,
                                  isUp ? PositionType.Before : PositionType.After
                              );
                        newPos =
                            newPos.node.nodeType == NodeType.Element &&
                            isVoidHtmlElement(newPos.node)
                                ? new Position(
                                      newPos.node,
                                      newPos.isAtEnd ? PositionType.After : PositionType.Before
                                  )
                                : newPos;
                        const selection = editor.getDocument().defaultView?.getSelection();
                        selection?.setBaseAndExtent(
                            anchorNode,
                            anchorOffset,
                            newPos.node,
                            newPos.offset
                        );
                    }
                    this.state.lastTarget = selection.focusNode;
                    this.highlightSelection(this.state.lastTarget, vtable.table, false);
                });
            }
        } else {
            this.state.lastTarget = selection.focusNode;
            this.highlightSelection(this.state.lastTarget, this.targetTable, false);
        }
    }
    //#endregion

    //#region Mouse events
    private handleMouseDown(event: PluginMouseDownEvent) {
        if (event.rawEvent.which == Keys.RIGHT_CLICK && this.state.vSelection) {
            //If the user is right clicking To open context menu
            const td = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR);
            if (td?.classList.contains(TableMetadata.TABLE_CELL_SELECTED)) {
                const selection = this.editor.getDocument().defaultView.getSelection();
                selection.setBaseAndExtent(this.state.firstTarget, 0, this.state.lastTarget, 0);
                this.vTable.highlight();
                return;
            }
        }
        this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
        if (event.rawEvent.which == Keys.LEFT_CLICK && !event.rawEvent.shiftKey) {
            this.clearState();

            this.state.firstTarget =
                this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    event.rawEvent.target as Node
                ) || (event.rawEvent.target as HTMLElement);
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            this.state.startedSelection = true;
        }
    }

    private handleMouseUp(event: PluginMouseUpEvent) {
        if (
            event.isClicking &&
            this.range.collapsed &&
            !this.state.vSelection &&
            event.rawEvent.which != Keys.RIGHT_CLICK
        ) {
            this.clearTableCellSelection();
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        this.range = this.editor.getSelectionRange();
        let eventTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, event.target as Node) ||
            (event.target as HTMLElement);

        //Ignore if
        // Is a DIV that only contains a Table
        // If the event target is not contained in the editor.
        if (
            (eventTarget.childElementCount == 1 &&
                getTagOfNode(eventTarget.lastChild) == 'TABLE' &&
                getTagOfNode(eventTarget) == 'DIV') ||
            !this.contentDiv.contains(eventTarget)
        ) {
            event.preventDefault();
            return;
        }

        // Handle if the table cell contains a Paragraph.
        // Most of the Word tables contain a P inside each cell.
        if (
            getTagOfNode(event.target as Node) == 'p' &&
            eventTarget != (event.target as Node) &&
            safeInstanceOf(eventTarget, 'HTMLTableCellElement')
        ) {
            updateSelection(this.editor, eventTarget, 0);
            event.preventDefault();
            return;
        }

        let firstTable = this.editor.getElementAtCursor(
            'table',
            this.state.firstTarget
        ) as HTMLTableElement;
        let targetTable = this.editor.getElementAtCursor('table', eventTarget);
        ({ eventTarget, firstTable, targetTable } = this.prepareSelection(
            eventTarget,
            firstTable,
            targetTable
        ));

        const targetIsValid = targetTable == firstTable;
        const isNewTDContainingFirstTable = safeInstanceOf(eventTarget, 'HTMLTableCellElement')
            ? contains(eventTarget, firstTable)
            : false;

        if (firstTable && (targetIsValid || isNewTDContainingFirstTable)) {
            //When starting selection inside of a table and ends inside of the same table.
            this.selectionInsideTableMouseMove(eventTarget, targetTable, firstTable, event);
        } else {
            //If Selection starts out of a table, or moves out of a table.
            if (event.target != this.state.lastTarget || (eventTarget as HTMLTableCellElement)) {
                this.highlightSelection(eventTarget || (event.target as Node), targetTable, true);
            }
        }

        //Maintain the first and last target as the mouse moves
        this.state.firstTarget = this.state.firstTarget || eventTarget;
        this.state.firstTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.state.firstTarget) ||
            this.state.firstTarget;

        if (this.state.firstTarget == this.contentDiv) {
            this.state.firstTarget = null;
        }
        if (eventTarget != this.contentDiv) {
            this.state.lastTarget = eventTarget || this.state.lastTarget;
        }
    };

    // If selection  started outside of a table or moves outside of the first table and finishes inside of a different table,
    // selects all the row in the table where it started and where it finished
    private onMouseUp = () => {
        if (this.editor) {
            this.selectAllRow();
            this.removeMouseUpEventListener();
        }
    };

    private selectionInsideTableMouseMove(
        eventTarget: HTMLElement,
        targetTable: HTMLElement,
        firstTable: HTMLTableElement,
        event: MouseEvent
    ) {
        const firstTableTD = this.editor.getElementAtCursor(
            TABLE_CELL_SELECTOR,
            this.state.firstTarget
        );

        if (eventTarget && this.state.lastTarget && eventTarget != this.state.firstTarget) {
            if (this.range && this.shouldConvertToVSelection()) {
                if (targetTable != firstTable && targetTable?.contains(firstTable)) {
                    //If selection started in a table that is inside of another table and moves to parent table
                    //Make the firstTarget the TD of the parent table.
                    this.state.firstTarget = this.editor.getElementAtCursor(
                        TABLE_CELL_SELECTOR,
                        eventTarget
                    );
                    (this.state.firstTarget as HTMLElement)
                        .querySelectorAll('table')
                        .forEach(table => {
                            const vTable = new VTable(table);
                            vTable.highlightAll();
                        });
                }
                const currentTargetTD = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    eventTarget
                ) as HTMLTableCellElement;

                if (firstTable && currentTargetTD) {
                    //Virtual Selection, handled when selection started inside of a table and the end of the selection
                    //Is in the same table.
                    this.state.vSelection = true;
                    if (
                        this.vTable?.table != firstTable &&
                        safeInstanceOf(firstTableTD, 'HTMLTableCellElement')
                    ) {
                        this.vTable = new VTable(firstTableTD);
                    }

                    this.state.startRange = this.vTable.getCellCoordinates(firstTableTD);
                    this.state.endRange = this.vTable.getCellCoordinates(
                        currentTargetTD ?? firstTableTD
                    );
                    this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

                    updateSelection(this.editor, firstTableTD, 0);
                }

                event.preventDefault();
            }
        } else if (eventTarget == this.state.firstTarget && this.state.vSelection) {
            this.vTable = new VTable(firstTable);
            this.state.startRange = this.vTable.getCellCoordinates(firstTableTD);

            this.vTable.highlightSelection(this.state.startRange, this.state.startRange);

            this.state.startRange = this.vTable.startRange;
            this.state.endRange = this.state.endRange;
        }
    }

    private removeMouseUpEventListener(): void {
        if (this.state.startedSelection) {
            this.state.startedSelection = false;
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
        if (this.state.startedSelection) {
            return;
        }
        const eventTarget = event.target as HTMLElement;
        const table = this.editor.getElementAtCursor('table', eventTarget);

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
                    this.tableSelector.style.display = 'none';
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
                        this.state.lastTarget = node;
                    });

                    this.editor.focus();
                    this.range = new Range();
                    this.range.selectNodeContents(this.state.lastTarget);
                    this.range.collapse();
                    this.editor.select(this.range);

                    vTable.highlightAll();
                    this.state.startRange = vTable.startRange;
                    this.state.endRange = vTable.endRange;
                    this.state.firstTarget =
                        vTable.cells[this.state.startRange[1]][this.state.startRange[0]].td;
                    this.state.lastTarget =
                        vTable.cells[this.state.endRange[1]][this.state.endRange[0]].td;
                    this.state.vSelection = true;
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

    //#region utils
    private clearTableCellSelection() {
        if (this.editor?.hasFocus()) {
            clearSelectedTableCells(this.contentDiv);
        }
    }

    private clearState() {
        this.clearTableCellSelection();
        this.vTable = null;
        this.state.firstTarget = null;
        this.state.lastTarget = null;
        this.state.startRange = null;
        this.state.endRange = null;
        this.state.vSelection = false;
        this.firstTable = null;
        this.targetTable = null;
    }

    private isAfter(node1: Node, node2: Node) {
        if (node1 && node2) {
            if (node1 == this.contentDiv) {
                node1 = this.range.endContainer;
            }

            const position = new Position(node1, PositionType.End);
            return position.isAfter(new Position(node2, PositionType.End));
        }
        return false;
    }

    private cacheTables() {
        if (!this.cachedTables) {
            this.cachedTables = [];
        }
        this.editor?.queryElements('table', table => {
            if (
                table.isContentEditable &&
                !this.editor.getElementAtCursor('table', table.parentNode)
            ) {
                const filteredTables = this.cachedTables.filter(vT => vT.table == table);
                if (filteredTables.length == 0) {
                    const vTable = new VTable(table);
                    this.cachedTables.push(vTable);
                } else {
                    const currentTable = filteredTables[0];
                    this.cachedTables[this.cachedTables.indexOf(currentTable)] = new VTable(table);
                }
            }
        });

        this.cachedTables = this.cachedTables.filter(vt => this.contentDiv.contains(vt.table));

        const tempTables = this.cachedTables;

        tempTables.forEach(vTable => {
            if (!this.contentDiv.contains(vTable.table)) {
                this.cachedTables.slice(this.cachedTables.indexOf(vTable), 1);
            }
        });
    }

    private getNextTD(event: PluginKeyDownEvent | PluginKeyUpEvent): number[] {
        this.state.lastTarget = this.editor.getElementAtCursor(
            TABLE_CELL_SELECTOR,
            this.state.lastTarget
        );

        if (safeInstanceOf(this.state.lastTarget, 'HTMLTableCellElement')) {
            if (
                !this.vTable ||
                this.vTable.table != this.editor.getElementAtCursor('table', this.state.lastTarget)
            ) {
                this.vTable = new VTable(this.state.lastTarget);
            }
            let coordinates = this.vTable.getCellCoordinates(this.state.lastTarget);

            switch (event.rawEvent.which) {
                case Keys.RIGHT:
                    coordinates[0] += this.state.lastTarget.colSpan;
                    if (this.vTable.cells[coordinates[1]][coordinates[0]] == null) {
                        coordinates[0] = this.vTable.cells[coordinates[1]].length - 1;
                        coordinates[1]++;
                    }
                    break;
                case Keys.LEFT:
                    if (coordinates[0] == 0) {
                        coordinates[1]--;
                    } else {
                        coordinates[0]--;
                    }
                    break;
                case Keys.UP:
                    coordinates[1]--;
                    break;
                case Keys.DOWN:
                    coordinates[1]++;
                    break;
            }
            if (coordinates[1] >= 0 && coordinates[0] >= 0) {
                this.state.lastTarget = this.vTable.getTd(coordinates[1], coordinates[0]);
            }
            return coordinates;
        }
        return null;
    }

    //Check if the selection started in a inner table.
    private prepareSelection(
        eventTarget: HTMLElement,
        firstTable: HTMLTableElement,
        targetTable: HTMLElement
    ) {
        let isNewTargetTableContained =
            eventTarget != this.state.firstTarget &&
            firstTable?.contains(
                findClosestElementAncestor(targetTable, firstTable, TABLE_CELL_SELECTOR)
            );

        if (isNewTargetTableContained && this.state.vSelection) {
            while (isNewTargetTableContained) {
                eventTarget = findClosestElementAncestor(
                    targetTable,
                    firstTable,
                    TABLE_CELL_SELECTOR
                );
                targetTable = this.editor.getElementAtCursor('table', eventTarget);
                isNewTargetTableContained =
                    eventTarget != this.state.firstTarget &&
                    firstTable?.contains(
                        findClosestElementAncestor(targetTable, firstTable, TABLE_CELL_SELECTOR)
                    );
            }
        }

        let isFirstTargetTableContained =
            eventTarget != this.state.firstTarget &&
            targetTable?.contains(
                findClosestElementAncestor(firstTable, targetTable, TABLE_CELL_SELECTOR)
            );

        if (isFirstTargetTableContained && this.state.vSelection) {
            while (isFirstTargetTableContained) {
                this.state.firstTarget = findClosestElementAncestor(
                    firstTable,
                    targetTable,
                    TABLE_CELL_SELECTOR
                );
                firstTable = this.editor.getElementAtCursor(
                    'table',
                    this.state.firstTarget
                ) as HTMLTableElement;
                isFirstTargetTableContained =
                    eventTarget != this.state.firstTarget &&
                    targetTable?.contains(
                        findClosestElementAncestor(firstTable, targetTable, TABLE_CELL_SELECTOR)
                    );
            }
        }
        return { eventTarget, firstTable, targetTable };
    }

    private highlightSelection(
        currentTarget: Node,
        targetTable: HTMLElement,
        isFromMouseEvent: boolean = true
    ) {
        if (currentTarget == this.contentDiv) {
            return;
        }
        currentTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, currentTarget) || currentTarget;
        const isBeginAboveEnd = this.isAfter(this.state.firstTarget, this.state.lastTarget);
        const targetPosition = new Position(
            currentTarget,
            isBeginAboveEnd ? PositionType.End : PositionType.Begin
        );
        const isSelectionInsideTable =
            this.state.vSelection && this.state.firstTarget && this.vTable;
        if (isSelectionInsideTable) {
            if (!isFromMouseEvent) {
                updateSelection(
                    this.editor,
                    this.state.firstTarget,
                    0,
                    targetPosition.element,
                    targetPosition.offset
                );
            } else {
                if (isBeginAboveEnd) {
                    updateSelection(this.editor, this.state.firstTarget, 0);
                } else {
                    updateSelection(this.editor, this.state.firstTarget, 0);
                }
            }

            this.state.vSelection = false;
            this.vTable = new VTable(this.state.firstTarget as HTMLTableCellElement);
            let lastItemCoordinates = this.vTable.getCellCoordinates(
                this.state.firstTarget as HTMLElement
            );

            if (isBeginAboveEnd) {
                this.vTable.startRange = [0 /* x */, 0 /* y */];

                this.vTable.endRange = [
                    this.vTable.cells[lastItemCoordinates[1]].length - 1 /* x */,
                    lastItemCoordinates[1] /* y */,
                ];
            } else {
                this.vTable.endRange = [
                    this.vTable.cells[this.vTable.cells.length - 1].length - 1 /* x */,
                    this.vTable.cells.length - 1 /* y */,
                ];

                this.vTable.startRange = [0 /* x */, lastItemCoordinates[1] /* y */];
            }

            this.vTable.highlight();
        } else {
            //If the selection is not collapsed, verify what tables are inside of the range, and highlight the tables.
            this.handleSelectionOutsideOfTable(currentTarget, targetTable);
        }
    }

    private handleSelectionOutsideOfTable(currentTarget: Node, targetTable?: HTMLElement) {
        if (!targetTable) {
            targetTable = this.editor.getElementAtCursor('table', currentTarget);
        }

        if (
            safeInstanceOf(targetTable, 'HTMLTableElement') &&
            safeInstanceOf(currentTarget, 'HTMLTableCellElement')
        ) {
            let vTable = this.cachedTables.filter(table => table.table == targetTable)[0];

            let lastItemCoordinates = vTable.getCellCoordinates(currentTarget);
            if (this.isAfter(currentTarget, this.state.firstTarget)) {
                vTable.startRange = [0 /* x */, 0 /* y */];
                vTable.endRange = [
                    vTable.cells[lastItemCoordinates[1]].length - 1 /* x */,
                    lastItemCoordinates[1] /* y */,
                ];
            } else {
                vTable.endRange = [
                    vTable.cells[vTable.cells.length - 1].length - 1 /* x */,
                    vTable.cells.length - 1 /* y */,
                ];
                vTable.startRange = [0 /* x */, lastItemCoordinates[1] /* y */];
            }
            vTable.highlight();
        }

        //Check all the traversed tables
        //If the start and the current target are before the table, remove all selection and remove vTable from the traversed tables
        this.cachedTables.forEach(vTable => {
            if (
                /**
                 *  Deselect all the cells when the table is before the selection range
                 *  1. Check if table is after the first target
                 *  2. Check if table is after the last target
                 *  3. Check that current target is different than the parent of the table
                 *  4. Check that current target is different than the editor div.
                 */
                (this.isAfter(vTable.table, this.state.firstTarget) &&
                    this.isAfter(vTable.table, currentTarget) &&
                    vTable.table.parentNode != currentTarget &&
                    currentTarget != this.contentDiv) ||
                /**
                 *  Deselect all the cells when the table is after the selection range
                 *  1. Check if first target is after the table
                 *  2. Check if last target is after the table
                 *  3. Check that current target is different than the parent of the table
                 *  4. Check that current target is different than the editor div.
                 *  5-6. Need to check that the first and last target are not contained inside of the table.
                 */
                (this.isAfter(this.state.firstTarget, vTable.table) &&
                    this.isAfter(currentTarget, vTable.table) &&
                    vTable.table.parentNode != currentTarget &&
                    currentTarget != this.contentDiv &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget))
            ) {
                vTable.deSelectAll();
            }
        });

        //Select all cells if the current target is after and the start target is before the table
        this.cachedTables.forEach(vTable => {
            if (
                /**
                 *  Select all the cells when the table is after the selection this.range
                 *  1 - 2. Check if table is between the last and first targets
                 *  3 - 4. Need to check that the first and last target are not contained inside of the table.
                 */
                (this.isAfter(vTable.table, this.state.firstTarget) &&
                    !this.isAfter(vTable.table, currentTarget) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget)) ||
                /**
                 *  Select all the cells when the table is after the selection this.range
                 *  1 - 2. Check if table is between the last and first targets
                 *  3 - 4. Need to check that the first and last target are not contained inside of the table.
                 */
                (this.isAfter(this.state.firstTarget, vTable.table) &&
                    !this.isAfter(currentTarget, vTable.table) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget))
            ) {
                vTable.highlightAll();
            }
        });
    }

    private selectAllRow() {
        this.range = this.editor.getSelectionRange();
        if (
            (this.range &&
                (!(this.state.firstTarget && this.state.lastTarget) ||
                    (this.state.vSelection && this.range.collapsed))) ||
            this.contentDiv.querySelectorAll('.' + TableMetadata.TABLE_CELL_SELECTED).length == 0
        ) {
            return;
        }

        const selection = this.editor.getDocument().defaultView.getSelection();
        const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
        if (safeInstanceOf(this.state.firstTarget, 'HTMLTableCellElement')) {
            const row = this.editor.getElementAtCursor('tr', this.state.firstTarget);
            if (
                safeInstanceOf(row, 'HTMLTableRowElement') &&
                (safeInstanceOf(anchorNode, 'HTMLTableRowElement') ||
                    safeInstanceOf(anchorNode, 'HTMLTableCellElement'))
            ) {
                if (this.isAfter(this.state.firstTarget, this.state.lastTarget)) {
                    selection.setBaseAndExtent(row, row.cells.length, focusNode, focusOffset);
                } else {
                    selection.setBaseAndExtent(row, 0, focusNode, focusOffset);
                }
            }
        }
        if (
            safeInstanceOf(this.state.lastTarget, 'HTMLTableCellElement') &&
            (safeInstanceOf(focusNode, 'HTMLTableRowElement') ||
                safeInstanceOf(focusNode, 'HTMLTableCellElement'))
        ) {
            const row = this.editor.getElementAtCursor('tr', this.state.lastTarget);
            if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                if (this.isAfter(this.state.lastTarget, this.state.firstTarget)) {
                    selection.setBaseAndExtent(anchorNode, anchorOffset, row, row.cells.length);
                } else {
                    selection.setBaseAndExtent(anchorNode, anchorOffset, row, 0);
                }
            }
        }
    }
    // if the user selected all the text in a cell and started selecting another TD, we should convert to vSelection
    private shouldConvertToVSelection = () =>
        !(Browser.isFirefox
            ? getTagOfNode(this.range.commonAncestorContainer) == 'TBODY'
            : getTagOfNode(this.range.commonAncestorContainer) == 'TR' &&
              getTagOfNode(this.range.startContainer) == 'TR' &&
              getTagOfNode(this.range.endContainer) == 'TR' &&
              this.range.endContainer == this.range.startContainer);

    private setData() {
        const pos = this.editor.getFocusedPosition();
        if (pos) {
            this.firstTable = this.editor.getElementAtCursor(
                'table',
                this.state.firstTarget
            ) as HTMLTableElement;
            this.range = this.editor.getSelectionRange();
            this.targetTable = this.editor.getElementAtCursor('table', pos.node);
        }
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
    const selection = editor.getDocument().getSelection();
    end = end || start;
    endOffset = endOffset || offset;
    selection.setBaseAndExtent(start, offset, end, endOffset);
}

const validTags = ['TD', 'TH', 'TR'];
function isCell(node: Node) {
    let tag = getTagOfNode(node);
    return !!(
        tag &&
        (validTags.indexOf((<HTMLElement>node).style.display) >= 0 || validTags.indexOf(tag) >= 0)
    );
}
