import {
    BeforeCutCopyEvent,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PluginMouseUpEvent,
    PluginWithState,
    TableSelectionPluginState,
} from 'roosterjs-editor-types';
import {
    clearSelectedTableCells,
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    setTableSelectedRange,
    TableMetadata,
    VTable,
    isNodeAfter,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = TableMetadata.TABLE_CELL_SELECTOR;

/**
 * @internal
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements PluginWithState<TableSelectionPluginState> {
    private state: TableSelectionPluginState;

    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private CLEAR_SELECTION_TIMEOUT_JOB: number;
    private vTable: VTable;
    private traversedTables: VTable[];

    // private previousX: number;
    private previousY: number;

    // private currentX: number;
    private currentY: number;

    constructor(private contentDiv: HTMLDivElement) {
        this.state = {
            lastTarget: null,
            firstTarget: null,
            vSelection: false,
            startRange: [],
            endRange: [],
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
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.removeMouseUpEventListener();
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
                if (!this.mouseUpEventListerAdded) {
                    this.handleMouseDown(event);
                }
                break;
            case PluginEventType.KeyDown:
            case PluginEventType.KeyUp:
                if (!this.mouseUpEventListerAdded) {
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
        const range = this.editor?.getSelectionRange();
        this.state.firstTarget = this.state.firstTarget || range?.startContainer;
        if (getTagOfNode(this.state.firstTarget) == 'TR' && range) {
            this.state.firstTarget = range.startContainer;
        }
        const firstTable = this.editor.getElementAtCursor('table', this.state.firstTarget);
        if (event.rawEvent.shiftKey) {
            const next = (range.endContainer == this.state.lastTarget
                ? range.startContainer
                : range.endContainer) as Element;
            const lastTarget = this.editor.getElementAtCursor('table', range.endContainer);

            if (firstTable == lastTarget) {
                if (
                    firstTable == lastTarget &&
                    !range.collapsed &&
                    range.commonAncestorContainer.nodeType != Node.TEXT_NODE
                ) {
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
                    this.state.endRange = this.vTable.getCellCoordinates(next);
                    this.vTable.highlightSelection(this.state.startRange, this.state.endRange);
                    range.setStart(next, 0);
                    range.setEnd(next, 0);
                    this.state.vSelection = true;
                }
            } else {
                this.highlightSelection();
            }
            this.state.lastTarget = next;
        } else if (
            event.eventType == PluginEventType.KeyUp &&
            !event.rawEvent.shiftKey &&
            event.rawEvent.which != Keys.SHIFT
        ) {
            this.clearState();
        }
    }

    private handleMouseDown(event: PluginMouseDownEvent) {
        this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);

        if (!event.rawEvent.shiftKey) {
            this.clearState();
            this.editor
                .getDocument()
                .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
        }
        this.mouseUpEventListerAdded = true;
    }

    private handleMouseUp(event: PluginMouseUpEvent) {
        if (event.isClicking) {
            const currentWindow = this.editor.getDocument().defaultView;
            if (this.CLEAR_SELECTION_TIMEOUT_JOB) {
                currentWindow.clearTimeout(this.CLEAR_SELECTION_TIMEOUT_JOB);
            }
            this.clearTableCellSelection();
        }
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

    private onMouseMove = (event: MouseEvent) => {
        let eventTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, event.target as Node) ||
            (event.target as Node);

        this.currentY = event.pageY;

        //If the event target is part of the resize plugin elements, ignore
        if (isElementPartOfTableResize(eventTarget as HTMLElement)) {
            event.preventDefault();
            return;
        }

        if (
            getTagOfNode(event.target as Node) == 'p' &&
            eventTarget != (event.target as Node) &&
            safeInstanceOf(eventTarget, 'HTMLTableCellElement')
        ) {
            const range = this.editor.getSelectionRange();
            range.setStart(eventTarget, 0);
            range.setEnd(eventTarget, 0);
            event.preventDefault();
            return;
        }

        let firstTable = this.editor.getElementAtCursor('table', this.state.firstTarget);
        let targetTable = this.editor.getElementAtCursor('table', eventTarget);

        if (eventTarget.contains(firstTable)) {
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
            const table = this.editor.getElementAtCursor('TABLE', eventTarget) as HTMLTableElement;
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

                    if (table && currentTargetTD) {
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
                    setTableSelectedRange(table, firstTableTD, firstTableTD);
                    event.preventDefault();
                }
            }
        } else {
            if (event.target != this.state.lastTarget || (eventTarget as HTMLTableCellElement)) {
                this.highlightSelectionMouseMove(
                    eventTarget || (event.target as Node),
                    targetTable,
                    firstTable,
                    event
                );
            }
        }

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

    private prepareSelection(eventTarget: Node, firstTable: HTMLElement, targetTable: HTMLElement) {
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
                firstTable = this.editor.getElementAtCursor('table', this.state.firstTarget);
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

        if (node2.contains(node1) && getTagOfNode(node2) == 'div') {
            return this.currentY > this.previousY;
        }

        return isNodeAfter(node1, node2) || node1.contains(node2);
    }

    private highlightSelectionMouseMove(
        currentTarget: Node,
        targetTable: HTMLElement,
        firstTable: HTMLElement,
        event: MouseEvent
    ) {
        if (!this.contentDiv.contains(currentTarget)) {
            return;
        }

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
            if (isNodeAfter(this.state.firstTarget, this.state.lastTarget)) {
                range.setStart(this.state.lastTarget, 0);
            } else {
                range.setStart(this.state.firstTarget, 0);
                range.setEnd(this.state.lastTarget, 0);
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

            //If current target is the div container of the table, select all the table
            if (
                (event.target as HTMLElement).querySelector('table') &&
                (event.target as Node) != this.state.firstTarget
            ) {
                let vTable = this.traversedTables.filter(table => table.table == targetTable)[0];
                if (!vTable) {
                    vTable = new VTable((event.target as HTMLElement).querySelector('table'));
                }
                vTable.startRange = [0, 0];
                vTable.endRange = [
                    vTable.cells[vTable.cells.length - 1].length - 1,
                    vTable.cells.length - 1,
                ];
                vTable.highlight();
                this.traversedTables.push(vTable);
            }
        }
    }

    private highlightSelection() {
        const range = this.editor.getSelectionRange();

        if (this.state.vSelection && this.state.firstTarget) {
            range.setStart(this.state.firstTarget, 0);
            this.state.vSelection = false;
        }
        if (range.commonAncestorContainer) {
            clearSelectedTableCells(range.commonAncestorContainer);
        }

        const selection = this.editor.getSelectionTraverser();
        let firstTDSelected: HTMLTableCellElement;
        let lastTDSelected: HTMLTableCellElement;
        let table: HTMLTableElement;

        while (selection?.currentInlineElement) {
            let currentElement = selection.currentInlineElement;
            let element = currentElement.getContainerNode();
            selection.getNextInlineElement();

            if (getTagOfNode(element) != 'TD' && getTagOfNode(element) != 'TH') {
                element = findClosestElementAncestor(
                    element,
                    range.commonAncestorContainer,
                    TABLE_CELL_SELECTOR
                );
            }

            let tempTable = findClosestElementAncestor(
                element,
                range.commonAncestorContainer,
                'table'
            ) as HTMLTableElement;
            if (!(table && table.contains(tempTable) && table != tempTable)) {
                if (element && safeInstanceOf(element, 'HTMLTableCellElement')) {
                    if (tempTable && tempTable != table) {
                        table = tempTable;
                        firstTDSelected = element;
                    } else {
                        lastTDSelected = element;
                    }

                    if (selection.currentInlineElement == currentElement) {
                        this.handleHighlightSelection(table, firstTDSelected, lastTDSelected);
                        break;
                    }
                } else {
                    if (table) {
                        this.handleHighlightSelection(table, firstTDSelected, lastTDSelected);
                    }
                }
            }

            if (selection.currentInlineElement == currentElement) {
                break;
            }
        }
    }

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
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

            this.removeMouseUpEventListener();
        }
    };

    private handleHighlightSelection(
        table: HTMLTableElement,
        firstTDSelected: HTMLElement,
        lastTDSelected: HTMLElement
    ) {
        if (table) {
            const rows = Array.from(table.querySelectorAll('tr'));

            let firstRow: HTMLTableRowElement;
            let lastRow: HTMLTableRowElement;
            rows.forEach(row => {
                if (row?.contains(firstTDSelected)) {
                    firstRow = row as HTMLTableRowElement;
                }
                if (row?.contains(lastTDSelected)) {
                    lastRow = row as HTMLTableRowElement;
                }
            });
            if (firstRow && lastRow) {
                setTableSelectedRange(
                    table,
                    firstRow.cells[0],
                    lastRow.cells[lastRow.cells.length - 1]
                );
            }
        }
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
