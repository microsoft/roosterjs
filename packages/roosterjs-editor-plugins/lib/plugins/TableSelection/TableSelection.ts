import {
    BeforeCutCopyEvent,
    ContentPosition,
    IEditor,
    Keys,
    KnownCreateElementDataIndex,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PluginMouseUpEvent,
    PluginWithState,
    PositionType,
    Rect,
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
    isBlockElement,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = TableMetadata.TABLE_CELL_SELECTOR;
const TABLE_SELECTOR_ID = 'tableSelector';
const TABLE_SELECTOR_LENGTH = 12;
const LEFT_CLICK = 1;
const RIGHT_CLICK = 3;

/**
 * The state object for TableSelectionPlugin
 */
interface TableSelectionPluginState {
    lastTarget: Node;
    firstTarget: Node;
    startRange: number[];
    endRange: number[];
    vSelection: boolean;
    startedSelection: boolean;
}
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
            this.range = this.editor.getSelectionRange();

            switch (event.eventType) {
                case PluginEventType.ExtractContentWithDom:
                    clearSelectedTableCells(event.clonedRoot);
                    break;
                case PluginEventType.MouseUp:
                    this.handleMouseUpEvent(event);
                    break;
                case PluginEventType.BeforeCutCopy:
                    this.handleBeforeCutCopyEvent(event);
                    break;
                case PluginEventType.MouseDown:
                    if (!this.state.startedSelection) {
                        this.handleMouseDownEvent(event);
                    }
                    break;
                case PluginEventType.KeyDown:
                    if (!this.state.startedSelection) {
                        this.handleKeyDownEvent(event);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.KeyUp:
                    if (!this.state.startedSelection) {
                        this.handleKeyUpEvent(event);
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
    private handleBeforeCutCopyEvent(event: BeforeCutCopyEvent) {
        // if (event.vTableSelection) {
        //     const clonedTable = event.clonedRoot.querySelector('table');
        //     const clonedVTable = new VTable(clonedTable);
        //     clonedVTable.startRange = event.vTableStartRange;
        //     clonedVTable.endRange = event.vTableEndRange;
        //     clonedVTable.removeCellsBySelection();
        //     clonedVTable.writeBack();
        //     event.range.setStart(clonedTable.parentNode, 0);
        //     event.range.setEndAfter(clonedTable);
        //     if (event.isCut) {
        //         this.vTable.forEachSelectedCell(cell => {
        //             if (cell?.td) {
        //                 const deleteRange = new Range();
        //                 deleteRange.selectNodeContents(cell.td);
        //                 deleteRange.deleteContents();
        //                 cell.td.appendChild(this.editor.getDocument().createElement('BR'));
        //             }
        //         });
        //         this.clearState();
        //     }
        // }
        // clearSelectedTableCells(event.clonedRoot);
    }

    //#region Key events
    /**
     * Handles the on key event.
     * @param event the plugin event
     */
    private handleKeyDownEvent(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        if (
            (event.rawEvent.ctrlKey || event.rawEvent.metaKey) &&
            !(event.rawEvent.shiftKey && (event.rawEvent.ctrlKey || event.rawEvent.metaKey))
        ) {
            return;
        }
        const pos = this.editor.getFocusedPosition();
        this.range = this.editor.getSelectionRange();

        this.state.firstTarget = this.state.firstTarget || pos.node;
        let forceSelection = false;
        if (getTagOfNode(this.state.firstTarget) == 'TR' && this.range) {
            this.state.firstTarget = pos.node;
        }

        if (
            (event.rawEvent.shiftKey && event.eventType == PluginEventType.KeyDown) ||
            forceSelection
        ) {
            const commonAncestorContainer = this.range.commonAncestorContainer;
            const ancestorTag = getTagOfNode(commonAncestorContainer);
            if (event.rawEvent.which == Keys.SHIFT) {
                return;
            }

            if (
                (!this.state.vSelection &&
                    !isBlockElement(commonAncestorContainer) &&
                    this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, commonAncestorContainer)) ||
                (!this.state.vSelection &&
                    ancestorTag == 'TD' &&
                    !forceSelection &&
                    !this.range.collapsed)
            ) {
                return;
            }
            this.state.lastTarget = this.state.lastTarget ?? this.state.firstTarget;
            this.setData(false);
            if (this.firstTable! == this.targetTable!) {
                if (ancestorTag != 'TR' && !this.state.vSelection) {
                    return;
                }
                //When selection start and end is inside of the same table
                this.handleKeySelectionInsideTable(event);
            } else {
                clearSelectedTableCells(this.contentDiv);
            }
        }
    }

    private handleKeyUpEvent(event: PluginKeyUpEvent) {
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
            this.state.lastTarget =
                this.state.lastTarget == this.state.firstTarget
                    ? this.state.lastTarget
                    : this.range.endContainer;
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

                const sel = this.editor.getDocument().defaultView.getSelection();
                const { anchorNode, anchorOffset } = sel;
                sel.setBaseAndExtent(anchorNode, anchorOffset, position.node, position.offset);
                this.state.lastTarget = position.node;
                event.rawEvent.preventDefault();
                return;
            }
        }

        this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

        this.state.vSelection = true;
        event.rawEvent.preventDefault();
    }
    //#endregion

    //#region Mouse events
    private handleMouseDownEvent(event: PluginMouseDownEvent) {
        if (event.rawEvent.which == RIGHT_CLICK && this.state.vSelection) {
            //If the user is right clicking To open context menu
            const td = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR);
            if (td?.classList.contains(TableMetadata.TABLE_CELL_SELECTED)) {
                this.state.firstTarget = null;
                this.state.lastTarget = null;

                this.editor.queryElements('td.' + TableMetadata.TABLE_CELL_SELECTED, node => {
                    this.state.firstTarget = this.state.firstTarget || node;
                    this.state.lastTarget = node;
                });
                const selection = this.editor.getDocument().defaultView.getSelection();
                selection.setBaseAndExtent(this.state.firstTarget, 0, this.state.lastTarget, 0);
                this.vTable.highlight();
                return;
            }
        }
        this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);
        if (event.rawEvent.which == LEFT_CLICK && !event.rawEvent.shiftKey) {
            this.clearState();
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            this.state.startedSelection = true;
        }
    }

    private handleMouseUpEvent(event: PluginMouseUpEvent) {
        if (
            event.isClicking &&
            this.range.collapsed &&
            !this.state.vSelection &&
            event.rawEvent.which != RIGHT_CLICK
        ) {
            this.clearTableCellSelection();
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        if (event.currentTarget == this.contentDiv) {
            return;
        }
        this.range = this.editor.getSelectionRange();
        let eventTarget =
            getCellAtCursor(this.editor, event.target as Node) || (event.target as HTMLElement);
        this.setData();
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
            clearSelectedTableCells(this.contentDiv);
        }
    };

    // If selection  started outside of a table or moves outside of the first table and finishes inside of a different table,
    // selects all the row in the table where it started and where it finished
    private onMouseUp = () => {
        if (this.editor) {
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

        if (
            this.state.firstTarget &&
            eventTarget &&
            this.state.lastTarget &&
            eventTarget != this.state.firstTarget
        ) {
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

    // if the user selected all the text in a cell and started selecting another TD, we should convert to vSelection
    private shouldConvertToVSelection = () =>
        !(Browser.isFirefox
            ? getTagOfNode(this.range.commonAncestorContainer) == 'TBODY'
            : getTagOfNode(this.range.commonAncestorContainer) == 'TR' &&
              getTagOfNode(this.range.startContainer) == 'TR' &&
              getTagOfNode(this.range.endContainer) == 'TR' &&
              this.range.endContainer == this.range.startContainer);

    private setData(setTargets: boolean = true) {
        const pos = this.editor.getFocusedPosition();
        if (pos) {
            this.firstTable = this.editor.getElementAtCursor(
                'table',
                this.state.firstTarget
            ) as HTMLTableElement;
            this.range = this.editor.getSelectionRange();
            this.targetTable = this.editor.getElementAtCursor('table', pos.node);
            if (setTargets) {
                this.state.firstTarget =
                    this.state.firstTarget || getCellAtCursor(this.editor, pos.node);
                this.state.lastTarget = getCellAtCursor(this.editor, pos.node);

                if (this.state.firstTarget == this.contentDiv && this.state.lastTarget) {
                    this.state.firstTarget = this.state.lastTarget;
                }
            }
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
    const selection = editor.getDocument().defaultView.getSelection();
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

function getCellAtCursor(editor: IEditor, node: Node) {
    if (editor) {
        return editor.getElementAtCursor(TABLE_CELL_SELECTOR, node) || (node as HTMLElement);
    }
    return node as HTMLElement;
}
