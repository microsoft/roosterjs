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
    isNodeAfter,
    createElement,
    normalizeRect,
    queryElements,
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

    // Stores all tables in the current contentDiv, used when selection starts outside of table
    // Or moves outside of a table
    private cachedTables: VTable[];

    // Used to determine whether if the previous element is after the last target
    private previousY: number;
    private currentY: number;

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
                    clearSelectedTableCells(event.clonedRoot, true);
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
                    }
                    break;
                case PluginEventType.KeyUp:
                    if (!this.state.startedSelection) {
                        this.handleKeyUp(event);
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
        this.state.firstTarget = this.state.firstTarget || this.range?.startContainer;
        let forceSelection = false;
        if (getTagOfNode(this.state.firstTarget) == 'TR' && this.range) {
            this.state.firstTarget = this.range.startContainer;
        }

        //If the selection started in a text node inside of a table cell and the selection moves to the next cell
        if (
            !this.range.collapsed &&
            getTagOfNode(this.range.commonAncestorContainer) == 'TR' &&
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.range.startContainer)
        ) {
            modifyRange(
                this.range,
                this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.range.startContainer),
                0
            );
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
            if (event.rawEvent.which == Keys.SHIFT) {
                return;
            }

            if (this.range.commonAncestorContainer.nodeType == Node.TEXT_NODE) {
                return;
            }
            let firstTable = this.editor.getElementAtCursor(
                'table',
                this.state.firstTarget
            ) as HTMLTableElement;
            let targetTable = this.editor.getElementAtCursor('table', this.range.endContainer);
            this.state.lastTarget = this.state.lastTarget ?? this.state.firstTarget;

            if (firstTable && targetTable && firstTable == targetTable) {
                //When selection start and end is inside of the same table
                this.handleKeySelectionInsideTable(firstTable, event, targetTable);
            } else {
                this.state.lastTarget = this.editor.getElementAtCursor();
                this.highlightSelection(
                    this.state.lastTarget,
                    this.editor.getElementAtCursor('table', this.state.lastTarget),
                    firstTable,
                    false
                );
            }
        }
    }

    private handleKeyUp(event: PluginKeyUpEvent) {
        if (
            this.range.collapsed &&
            !this.state.vSelection &&
            !this.range.collapsed &&
            this.range.commonAncestorContainer.nodeType != Node.TEXT_NODE
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

    private handleKeySelectionInsideTable(
        firstTable: HTMLTableElement,
        event: PluginKeyDownEvent | PluginKeyUpEvent,
        targetTable: HTMLElement
    ) {
        if (!this.range.collapsed) {
            this.state.lastTarget = this.range.endContainer;
            modifyRange(this.range, this.state.firstTarget, 0);
        }
        if (!this.vTable) {
            this.vTable = new VTable(firstTable as HTMLTableElement);
            if (this.state.firstTarget.nodeType == Node.TEXT_NODE) {
                this.state.firstTarget = this.editor.getElementAtCursor(
                    TABLE_CELL_SELECTOR,
                    this.state.firstTarget
                );
            }
            this.state.startRange = this.vTable.getCellCoordinates(
                this.state.firstTarget as Element
            );
        }
        this.state.endRange = this.getNextTD(event);
        if (this.state.endRange[1] > this.vTable.cells.length - 1 || this.state.endRange[1] == -1) {
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
                this.state.lastTarget =
                    this.state.endRange[1] == -1
                        ? eventTarget.previousSibling
                        : eventTarget.nextSibling;
                this.highlightSelection(
                    this.state.lastTarget,
                    this.editor.getElementAtCursor('table', this.state.lastTarget),
                    firstTable,
                    false
                );
                event.rawEvent.preventDefault();
                return;
            }
        }
        if (this.vTable?.table != firstTable) {
            this.vTable.deSelectAll();
            this.vTable = new VTable(firstTable);
            this.state.startRange = this.vTable.getCellCoordinates(
                this.state.firstTarget as Element
            );
            this.state.endRange = this.state.startRange;
            this.state.lastTarget = this.state.firstTarget;
            modifyRange(this.range, this.state.firstTarget, 0);
        }
        this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

        this.state.vSelection = true;
        event.rawEvent.preventDefault();
    }

    private getNextTD(event: PluginKeyDownEvent | PluginKeyUpEvent): number[] {
        if (safeInstanceOf(this.state.lastTarget, 'HTMLTableCellElement')) {
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
            this.state.lastTarget = this.vTable.getTd(coordinates[1], coordinates[0]);
            return coordinates;
        }
        return null;
    }

    private handleMouseDown(event: PluginMouseDownEvent) {
        if (event.rawEvent.which == Keys.RIGHT_CLICK && this.state.vSelection) {
            //If the user is right clicking To open context menu
            const td = this.editor.getElementAtCursor(TABLE_CELL_SELECTOR);
            if (td?.classList.contains(TableMetadata.TABLE_CELL_SELECTED)) {
                this.range.setStartBefore(this.state.firstTarget);
                this.range.setEndAfter(this.state.lastTarget);
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

        tempTables.forEach((vTable, index) => {
            if (!this.contentDiv.contains(vTable.table)) {
                this.cachedTables.slice(this.cachedTables.indexOf(vTable), 1);
            }
        });
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
        this.currentY = event.pageY;

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
            modifyRange(this.range, eventTarget, 0);
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
            ? eventTarget.contains(firstTable)
            : false;

        if (firstTable && (targetIsValid || isNewTDContainingFirstTable)) {
            //When starting selection inside of a table and ends inside of the same table.
            this.selectionInsideTableMouseMove(eventTarget, targetTable, firstTable, event);
        } else {
            //If Selection starts out of a table, or moves out of a table.
            if (event.target != this.state.lastTarget || (eventTarget as HTMLTableCellElement)) {
                this.highlightSelection(
                    eventTarget || (event.target as Node),
                    targetTable,
                    firstTable,
                    true
                );
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
        this.previousY = event.pageY;
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
            //Check if the container of the this.range is only text, means that the user only selected text inside of a cell
            if (this.range && this.range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
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

                    this.state.startRange = this.vTable.getCellCoordinates(
                        firstTableTD ?? (this.state.firstTarget as HTMLElement)
                    );
                    this.state.endRange = this.vTable.getCellCoordinates(
                        currentTargetTD ?? firstTableTD
                    );
                    this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

                    modifyRange(this.range, firstTableTD, 0);
                }

                event.preventDefault();
            }
        } else if (eventTarget == this.state.firstTarget) {
            if (this.range && this.range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
                this.vTable = new VTable(firstTable);
                this.state.startRange = this.vTable.getCellCoordinates(firstTableTD);

                this.vTable.highlightSelection(this.state.startRange, this.state.startRange);

                this.state.startRange = this.vTable.startRange;
                this.state.endRange = this.state.endRange;
            }
        }
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
        firstTable: HTMLElement,
        isFromMouseEvent: boolean = true
    ) {
        if (currentTarget == this.contentDiv) {
            return;
        }

        currentTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, currentTarget) || currentTarget;

        if (this.state.vSelection && this.state.firstTarget && this.vTable) {
            if (!isFromMouseEvent && currentTarget.contains(firstTable)) {
                currentTarget = currentTarget.nextSibling;
            }

            if (!isFromMouseEvent) {
                modifyRange(this.range, this.state.firstTarget, 0, currentTarget, 0);
            } else {
                if (isNodeAfter(this.state.firstTarget, this.state.lastTarget)) {
                    modifyRange(this.range, this.state.firstTarget, 0);
                } else {
                    modifyRange(this.range, this.state.firstTarget, 0);
                }
            }

            this.state.vSelection = false;
            this.vTable = new VTable(this.state.firstTarget as HTMLTableCellElement);
            let lastItemCoordinates = this.vTable.getCellCoordinates(
                this.state.firstTarget as HTMLElement
            );

            if (!this.isAfter(currentTarget, this.state.firstTarget)) {
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

    // If selection  started outside of a table or moves outside of the first table and finishes inside of a different table,
    // selects all the row in the table where it started and where it finished
    private onMouseUp = (event: MouseEvent) => {
        if (this.editor) {
            this.selectAllRow(event);
            this.removeMouseUpEventListener();
        }
    };

    private selectAllRow(event: MouseEvent) {
        this.range = this.editor.getSelectionRange();

        if (
            this.range &&
            (!(this.state.firstTarget && this.state.lastTarget) ||
                (this.state.vSelection && this.range.collapsed))
        ) {
            return;
        }

        if (safeInstanceOf(this.state.firstTarget, 'HTMLTableCellElement')) {
            const row = this.editor.getElementAtCursor('tr', this.state.firstTarget);
            if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                if (isNodeAfter(this.state.firstTarget, this.state.lastTarget)) {
                    this.range.setEnd(row, row.cells.length - 1);
                } else {
                    this.range.setStart(row, 0);
                }
            }
        }
        if (safeInstanceOf(this.state.lastTarget, 'HTMLTableCellElement')) {
            const row = this.editor.getElementAtCursor('tr', this.state.lastTarget);
            if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                if (isNodeAfter(this.state.lastTarget, this.state.firstTarget)) {
                    this.range.setEnd(row, row.cells.length - 1);
                } else {
                    this.range.setStart(row, 0);
                }
            }
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
                (isNodeAfter(vTable.table, this.state.firstTarget) &&
                    isNodeAfter(vTable.table, currentTarget) &&
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
                (isNodeAfter(this.state.firstTarget, vTable.table) &&
                    isNodeAfter(currentTarget, vTable.table) &&
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
                (isNodeAfter(vTable.table, this.state.firstTarget) &&
                    !isNodeAfter(vTable.table, currentTarget) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget)) ||
                /**
                 *  Select all the cells when the table is after the selection this.range
                 *  1 - 2. Check if table is between the last and first targets
                 *  3 - 4. Need to check that the first and last target are not contained inside of the table.
                 */
                (isNodeAfter(this.state.firstTarget, vTable.table) &&
                    !isNodeAfter(currentTarget, vTable.table) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget))
            ) {
                vTable.highlightAll();
            }
        });
    }

    private removeMouseUpEventListener(): void {
        if (this.state.startedSelection) {
            this.state.startedSelection = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

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
                    const range = new Range();
                    this.range.selectNodeContents(this.state.lastTarget);
                    this.range.collapse();
                    this.editor.select(range);

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

    private clearTableCellSelection() {
        if (this.editor) {
            if (this.editor.hasFocus()) {
                clearSelectedTableCells(this.contentDiv);
            }
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
    }

    private isAfter(node1: Node, node2: Node) {
        if (node1 == this.contentDiv) {
            node1 = this.range.endContainer;
        }

        if (node2?.contains(node1) && getTagOfNode(node2) == 'DIV') {
            return this.currentY > this.previousY;
        }

        return isNodeAfter(node1, node2) || node1.contains(node2);
    }
}

function modifyRange(range: Range, start: Node, offset: number, end?: Node, endOffset?: number) {
    range.setStart(start, offset);
    end = end || start;
    endOffset = endOffset || offset;
    range.setEnd(end, endOffset);
}
