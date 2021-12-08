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
    private state: TableSelectionPluginState;

    private editor: IEditor;
    private vTable: VTable;
    private traversedTables: VTable[];
    private previousY: number;
    private currentY: number;

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
            case PluginEventType.KeyUp:
                if (!this.state.startedSelection) {
                    this.handleKeyEvent(event);
                }
                break;
            default:
                break;
        }
    }

    private handleBeforeCutCopy(event: BeforeCutCopyEvent) {
        if (event.vTableSelection) {
            const clonedTable = event.clonedRoot.querySelector('table');

            const clonedVTable = new VTable(clonedTable);
            clonedVTable.startRange = event.vTableStartRange;
            clonedVTable.endRange = event.vTableEndRange;

            clonedVTable.removeCellsOutsideOfSelection();
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

            clearSelectedTableCells(event.clonedRoot);
        }
    }

    private handleKeyEvent(event: PluginKeyDownEvent | PluginKeyUpEvent) {
        if (
            (event.rawEvent.ctrlKey || event.rawEvent.metaKey) &&
            !(event.rawEvent.shiftKey && (event.rawEvent.ctrlKey || event.rawEvent.metaKey))
        ) {
            return;
        }
        const range = this.editor?.getSelectionRange();
        this.state.firstTarget = this.state.firstTarget || range?.startContainer;
        let forceSelection = false;
        if (getTagOfNode(this.state.firstTarget) == 'TR' && range) {
            this.state.firstTarget = range.startContainer;
        }

        if (
            !range.collapsed &&
            getTagOfNode(range.commonAncestorContainer) == 'TR' &&
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, range.startContainer)
        ) {
            range.setStart(
                this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, range.startContainer),
                0
            );
            range.setEnd(
                this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, range.startContainer),
                0
            );
            range.collapse();
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

            if (range.commonAncestorContainer.nodeType == Node.TEXT_NODE) {
                return;
            }

            const firstTable = this.editor.getElementAtCursor(
                'table',
                this.state.firstTarget
            ) as HTMLTableElement;

            const currentTable = this.editor.getElementAtCursor('table', range.endContainer);
            this.state.lastTarget = this.state.lastTarget ?? this.state.firstTarget;
            if (firstTable && currentTable && firstTable == currentTable && range.collapsed) {
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
                this.vTable.highlightSelection(this.state.startRange, this.state.endRange);

                this.state.vSelection = true;
                event.rawEvent.preventDefault();
                event.rawEvent.stopPropagation();
            } else {
                this.state.lastTarget = this.editor.getElementAtCursor();
                this.highlightSelectionMouseMove(
                    this.state.lastTarget,
                    this.editor.getElementAtCursor('table', this.state.lastTarget),
                    firstTable,
                    false
                );
            }
        } else if (
            event.eventType == PluginEventType.KeyUp &&
            !event.rawEvent.shiftKey &&
            event.rawEvent.which != Keys.SHIFT
        ) {
            this.clearState();
        }
    }

    getNextTD(event: PluginKeyDownEvent | PluginKeyUpEvent): number[] {
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
                    coordinates[0]--;
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
                const range = this.editor.getSelectionRange();
                range.setStartBefore(this.state.firstTarget);
                range.setEndAfter(this.state.lastTarget);
                this.vTable.highlight();
                return;
            }
        }
        this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);

        if (!event.rawEvent.shiftKey) {
            this.clearState();
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
        }
        this.state.startedSelection = true;
    }

    private handleMouseUp(event: PluginMouseUpEvent) {
        if (
            event.isClicking &&
            this.editor.getSelectionRange().collapsed &&
            !this.state.vSelection &&
            event.rawEvent.which != Keys.RIGHT_CLICK
        ) {
            this.clearTableCellSelection();
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        let eventTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, event.target as Node) ||
            (event.target as HTMLElement);
        const range = this.editor.getSelectionRange();
        this.currentY = event.pageY;

        let firstTable = this.editor.getElementAtCursor(
            'table',
            this.state.firstTarget
        ) as HTMLTableElement;
        let targetTable = this.editor.getElementAtCursor('table', eventTarget);

        //Ignore if
        // Is part of the Table Resize Plugin
        // Is a DIV that only contains a Table
        // If the event target is not contained in the editor.
        if (
            isElementPartOfTableResize(eventTarget as HTMLElement) ||
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
            range.setStart(eventTarget, 0);
            range.setEnd(eventTarget, 0);
            event.preventDefault();
            return;
        }

        ({ eventTarget, firstTable, targetTable } = this.prepareSelection(
            eventTarget,
            firstTable,
            targetTable
        ));

        const targetIsValid = targetTable == firstTable;
        const isNewTDContainingFirstTable = safeInstanceOf(eventTarget, 'HTMLTableCellElement')
            ? eventTarget.contains(firstTable)
            : false;

        //When starting selection inside of a table.
        if (firstTable && (targetIsValid || isNewTDContainingFirstTable)) {
            const firstTableTD = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR,
                this.state.firstTarget
            );
            const range = this.editor.getSelectionRange();

            if (eventTarget && this.state.lastTarget && eventTarget != this.state.firstTarget) {
                //Check if the container of the range is only text, means that the user only selected text inside of a cell
                if (range && range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
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

                        range.setStart(firstTableTD, 0);
                        range.setEnd(firstTableTD, 0);
                    }

                    event.preventDefault();
                }
            } else if (eventTarget == this.state.firstTarget) {
                if (range && range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
                    this.vTable = new VTable(firstTable);
                    this.state.startRange = this.vTable.getCellCoordinates(firstTableTD);

                    this.vTable.highlightSelection(this.state.startRange, this.state.startRange);

                    this.state.startRange = this.vTable.startRange;
                    this.state.endRange = this.state.endRange;

                    event.preventDefault();
                }
            }
        } else {
            //If Selection starts out of a table, or moves out of a table.
            if (event.target != this.state.lastTarget || (eventTarget as HTMLTableCellElement)) {
                this.highlightSelectionMouseMove(
                    eventTarget || (event.target as Node),
                    targetTable,
                    firstTable
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
            this.state.lastTarget = isElementPartOfTableResize(eventTarget as HTMLElement)
                ? this.state.lastTarget || eventTarget
                : eventTarget;
        }

        this.previousY = event.pageY;
    };

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

    private isAfter(node1: Node, node2: Node, range: Range) {
        if (node1 == this.contentDiv) {
            node1 = range.endContainer;
        }

        if (node2?.contains(node1) && getTagOfNode(node2) == 'DIV') {
            return this.currentY > this.previousY;
        }

        return isNodeAfter(node1, node2) || node1.contains(node2);
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
        this.traversedTables = [];
        this.state.firstTarget = null;
        this.state.lastTarget = null;
        this.state.startRange = null;
        this.state.endRange = null;
        this.state.vSelection = false;
    }

    private highlightSelectionMouseMove(
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
        const range = this.editor.getSelectionRange();

        if (safeInstanceOf(firstTable, 'HTMLTableElement')) {
            let vTable = this.traversedTables.filter(table => table.table == firstTable)[0];
            if (!vTable) {
                vTable = new VTable(firstTable);
                this.traversedTables.push(vTable);
            }
        }

        if (this.state.vSelection && this.state.firstTarget && this.vTable) {
            if (!isFromMouseEvent && currentTarget.contains(firstTable)) {
                currentTarget = currentTarget.nextSibling;
            }

            if (isNodeAfter(this.state.firstTarget, this.state.lastTarget)) {
                range.setStart(this.state.lastTarget, 0);
            } else {
                range.setStart(this.state.firstTarget, 0);

                if (isFromMouseEvent) {
                    range.setEnd(isFromMouseEvent ? this.state.lastTarget : currentTarget, 0);
                } else {
                    range.setEndAfter(currentTarget);
                }
            }
            this.state.vSelection = false;
            this.vTable = new VTable(this.state.firstTarget as HTMLTableCellElement);
            let lastItemCoordinates = this.vTable.getCellCoordinates(
                this.state.firstTarget as HTMLElement
            );

            if (!this.isAfter(currentTarget, this.state.firstTarget, range)) {
                this.vTable.startRange = [0, 0];

                this.vTable.endRange = [
                    this.vTable.cells[lastItemCoordinates[1]].length - 1,
                    lastItemCoordinates[1],
                ];
            } else {
                this.vTable.endRange = [
                    this.vTable.cells[this.vTable.cells.length - 1].length - 1,
                    this.vTable.cells.length - 1,
                ];

                this.vTable.startRange = [0, lastItemCoordinates[1]];
            }

            this.vTable.highlight();
        } else {
            if (
                safeInstanceOf(targetTable, 'HTMLTableElement') &&
                safeInstanceOf(currentTarget, 'HTMLTableCellElement')
            ) {
                let vTable = this.traversedTables.filter(table => table.table == targetTable)[0];
                if (!vTable) {
                    vTable = new VTable(targetTable);
                    this.traversedTables.push(vTable);
                }

                let lastItemCoordinates = vTable.getCellCoordinates(currentTarget);
                if (this.isAfter(currentTarget, this.state.firstTarget, range)) {
                    vTable.startRange = [0, 0];
                    vTable.endRange = [
                        vTable.cells[lastItemCoordinates[1]].length - 1,
                        lastItemCoordinates[1],
                    ];
                } else {
                    vTable.endRange = [
                        vTable.cells[vTable.cells.length - 1].length - 1,
                        vTable.cells.length - 1,
                    ];
                    vTable.startRange = [0, lastItemCoordinates[1]];
                }

                vTable.highlight();
            }
            const cleanSelection = this.traversedTables;
            //Check all the traversed tables
            //If the start and the current target are before the table, remove all selection and remove vTable from the traversed tables
            cleanSelection.forEach(vTable => {
                /**
                 *  Deselect all the cells when the table is before the selection range
                 *  1. Check if table is after the first target
                 *  2. Check if table is after the last target
                 *  3. Check that current target is different than the parent of the table
                 *  4. Check that current target is different than the editor div.
                 */
                if (
                    isNodeAfter(vTable.table, this.state.firstTarget) &&
                    isNodeAfter(vTable.table, currentTarget) &&
                    vTable.table.parentNode != currentTarget &&
                    currentTarget != this.contentDiv
                ) {
                    vTable.deSelectAll();
                    this.traversedTables.slice(this.traversedTables.indexOf(vTable));
                }

                /**
                 *  Deselect all the cells when the table is after the selection range
                 *  1. Check if first target is after the table
                 *  2. Check if last target is after the table
                 *  3. Check that current target is different than the parent of the table
                 *  4. Check that current target is different than the editor div.
                 *  5-6. Need to check that the first and last target are not contained inside of the table.
                 */
                if (
                    isNodeAfter(this.state.firstTarget, vTable.table) &&
                    isNodeAfter(currentTarget, vTable.table) &&
                    vTable.table.parentNode != currentTarget &&
                    currentTarget != this.contentDiv &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget)
                ) {
                    vTable.deSelectAll();
                    this.traversedTables.slice(this.traversedTables.indexOf(vTable));
                }
            });

            //Select all cells if the current target is after and the start target is before the table
            this.traversedTables.forEach(vTable => {
                const highlightAllCells = () => {
                    const cells = vTable.table.querySelectorAll(TABLE_CELL_SELECTOR);
                    vTable.startRange = vTable.getCellCoordinates(cells[0]);
                    vTable.endRange = vTable.getCellCoordinates(cells[cells.length - 1]);
                    vTable.highlight();
                };

                /**
                 *  Select all the cells when the table is after the selection range
                 *  1 - 2. Check if table is between the last and first targets
                 *  3 - 4. Need to check that the first and last target are not contained inside of the table.
                 */
                if (
                    isNodeAfter(vTable.table, this.state.firstTarget) &&
                    !isNodeAfter(vTable.table, currentTarget) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget)
                ) {
                    highlightAllCells();
                }

                /**
                 *  Select all the cells when the table is after the selection range
                 *  1 - 2. Check if table is between the last and first targets
                 *  3 - 4. Need to check that the first and last target are not contained inside of the table.
                 */
                if (
                    isNodeAfter(this.state.firstTarget, vTable.table) &&
                    !isNodeAfter(currentTarget, vTable.table) &&
                    !vTable.table.contains(currentTarget) &&
                    !vTable.table.contains(this.state.firstTarget)
                ) {
                    highlightAllCells();
                }
            });
        }
    }

    private removeMouseUpEventListener() {
        if (this.state.startedSelection) {
            this.state.startedSelection = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

    private onMouseUp = () => {
        if (this.editor) {
            const range = this.editor.getSelectionRange();

            if (
                !this.state.vSelection &&
                this.state.lastTarget != this.contentDiv &&
                !range.collapsed
            ) {
                if (range && range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
                    if (safeInstanceOf(this.state.firstTarget, 'HTMLTableCellElement')) {
                        const row = this.editor.getElementAtCursor('tr', this.state.firstTarget);
                        if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                            if (isNodeAfter(this.state.firstTarget, this.state.lastTarget)) {
                                range.setEndAfter(row.cells[row.cells.length - 1]);
                            } else {
                                range.setStartBefore(row.cells[0]);
                            }
                        }
                    }
                    if (safeInstanceOf(this.state.lastTarget, 'HTMLTableCellElement')) {
                        const row = this.editor.getElementAtCursor('tr', this.state.lastTarget);
                        if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                            if (isNodeAfter(this.state.lastTarget, this.state.firstTarget)) {
                                range.setEndAfter(row.cells[row.cells.length - 1]);
                            } else {
                                range.setStartBefore(row.cells[0]);
                            }
                        }
                    }
                }
            }

            if (range.collapsed && this.traversedTables.length == 1) {
                const vTable = this.traversedTables[0];
                this.vTable = vTable;
                this.state.endRange = vTable.endRange;
                this.state.startRange = vTable.startRange;
                this.state.vSelection = true;
                this.state.firstTarget = this.vTable.getCell(0, 0).td;
                this.state.lastTarget = this.vTable.getCell(
                    this.vTable.cells[this.vTable.cells.length - 1].length - 1,
                    this.vTable.cells.length - 1
                ).td;
                if (this.state.lastTarget) {
                    range.setEnd(this.state.lastTarget, 0);
                    range.collapse();
                }
            }
            this.removeMouseUpEventListener();
        }
    };

    private tableSelectorEvent = (event: MouseEvent) => {
        if (this.state.startedSelection) {
            return;
        }
        const eventTarget = event.target as HTMLElement;

        const table = this.editor.getElementAtCursor('table', eventTarget);
        if (table) {
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
                if (
                    eventTarget.id != TABLE_SELECTOR_ID &&
                    !isElementPartOfTableResize(eventTarget)
                ) {
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

    private setupSelectorContainer() {
        const document = this.editor.getDocument();
        this.wholeTableSelectorContainer = document.createElement('div');
        this.editor.insertNode(this.wholeTableSelectorContainer, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });
    }

    private removeSelectorContainer() {
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
                    range.selectNodeContents(this.state.lastTarget);
                    range.collapse();
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
}

function isElementPartOfTableResize(element: HTMLElement) {
    const HORIZONTAL_INSERTER_ID = 'horizontalInserter';
    const VERTICAL_INSERTER_ID = 'verticalInserter';
    const HORIZONTAL_RESIZER_ID = 'horizontalResizer';
    const VERTICAL_RESIZER_ID = 'verticalResizer';
    const TABLE_RESIZER_ID = 'tableResizer';

    if (element) {
        switch (element.id) {
            case HORIZONTAL_INSERTER_ID:
            case VERTICAL_INSERTER_ID:
            case VERTICAL_RESIZER_ID:
            case HORIZONTAL_RESIZER_ID:
            case TABLE_RESIZER_ID:
                return true;

            default:
                return false;
        }
    }

    return false;
}
