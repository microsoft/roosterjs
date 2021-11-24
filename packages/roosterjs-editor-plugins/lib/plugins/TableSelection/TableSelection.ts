import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    clearSelectedTableCells,
    findClosestElementAncestor,
    getTagOfNode,
    safeInstanceOf,
    setTableSelectedRange,
    TableMetadata,
    VTable,
} from 'roosterjs-editor-dom';

const TABLE_CELL_SELECTOR = TableMetadata.TABLE_CELL_SELECTOR;
/**
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements EditorPlugin {
    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private lastTarget: Node;
    private firstTarget: Node;
    private vTable: VTable;
    private CLEAR_SELECTION_TIMEOUT_JOB: number;

    private vSelection: boolean;

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

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.ExtractContentWithDom) {
            clearSelectedTableCells(event.clonedRoot, true);
            return;
        }
        if (event.eventType == PluginEventType.MouseUp) {
            if (!this.vSelection && event.isClicking) {
                const currentWindow = this.editor.getDocument().defaultView;
                if (this.CLEAR_SELECTION_TIMEOUT_JOB) {
                    currentWindow.clearTimeout(this.CLEAR_SELECTION_TIMEOUT_JOB);
                }
                this.CLEAR_SELECTION_TIMEOUT_JOB = currentWindow.setTimeout(() => {
                    this.clearTableCellSelection();
                    this.highlightSelection();
                }, 50);
            }
        }
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);

            if (!event.rawEvent.shiftKey) {
                this.clearTableCellSelection();

                this.lastTarget = null;
                this.firstTarget = null;
                this.editor
                    .getDocument()
                    .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            }
            this.mouseUpEventListerAdded = true;
        } else if (!this.mouseUpEventListerAdded) {
            if (
                event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.KeyUp
            ) {
                const range = this.editor?.getSelectionRange();
                this.firstTarget = this.firstTarget || range?.startContainer;
                if (getTagOfNode(this.firstTarget) == 'TR' && range) {
                    this.firstTarget = range.startContainer;
                }
                const firstTable = this.editor.getElementAtCursor('table', this.firstTarget);
                if (event.rawEvent.shiftKey) {
                    const next = (range.endContainer == this.lastTarget
                        ? range.startContainer
                        : range.endContainer) as Element;
                    const lastTarget = this.editor.getElementAtCursor('table', range.endContainer);

                    if (firstTable == lastTarget) {
                        if (
                            firstTable == lastTarget &&
                            !range.collapsed &&
                            range.commonAncestorContainer.nodeType != Node.TEXT_NODE
                        ) {
                            this.editor.runAsync(() => {
                                if (!this.vTable) {
                                    this.vTable = new VTable(firstTable as HTMLTableElement);
                                    if (this.firstTarget.nodeType == Node.TEXT_NODE) {
                                        this.firstTarget = this.editor.getElementAtCursor(
                                            TABLE_CELL_SELECTOR,
                                            this.firstTarget
                                        );
                                    }
                                    this.vTable.startRange = this.vTable.getCellCoordinates(
                                        this.firstTarget as Element
                                    );
                                }
                                this.vTable.endRange = this.vTable.getCellCoordinates(next);
                                this.vTable.highlight();
                                range.setStart(next, 0);
                                range.setEnd(next, 0);
                                this.vSelection = true;
                            });
                        }
                    } else {
                        this.highlightSelection();
                    }
                    this.lastTarget = next;
                } else if (
                    event.eventType == PluginEventType.KeyUp &&
                    !event.rawEvent.shiftKey &&
                    event.rawEvent.which != Keys.SHIFT
                ) {
                    this.clearVTable();
                }
            }
        }
    }

    private clearTableCellSelection() {
        if (this.editor) {
            let range = this.editor.getSelectionRange();
            if (
                this.editor.hasFocus() &&
                ((!this.vSelection && range && !range.collapsed) || this.vSelection)
            ) {
                clearSelectedTableCells(this.editor.getScrollContainer());
            }
        }
    }

    private clearVTable() {
        if (this.vTable) {
            this.vTable?.forEachCell(cell => {
                this.vTable.deselectCellHandler(cell.td);
            });
            this.vTable = null;
        } else if (this.vTable == undefined) {
            clearSelectedTableCells(this.editor.getScrollContainer());
        }
        this.firstTarget = null;
        this.lastTarget = null;
    }

    private onMouseMove = (event: MouseEvent) => {
        let eventTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, event.target as Node) ||
            (event.target as Node);

        //If the event target is part of the resize plugin elements, ignore
        if (isIDPartSelector(eventTarget as HTMLElement)) {
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

        let firstTable = this.editor.getElementAtCursor('table', this.firstTarget);
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

        //When starting selection inside of a table.
        if (firstTable && (targetIsValid || isNewTDContainingFirstTable)) {
            const table = this.editor.getElementAtCursor('TABLE', eventTarget) as HTMLTableElement;
            const firstTableTD = this.editor.getElementAtCursor(
                TABLE_CELL_SELECTOR,
                this.firstTarget
            );
            const range = this.editor.getSelectionRange();

            if (eventTarget && this.lastTarget && eventTarget != this.firstTarget) {
                //Virtual Selection, handled when selection started inside of a table and the end of the selection
                //Is in the same table.
                if (!this.vSelection) {
                    this.vSelection = true;
                }

                //Check if the container of the range is only text, means that the user only selected text inside of a cell
                if (range && range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
                    if (targetTable != firstTable && targetTable?.contains(firstTable)) {
                        //If selection started in a table that is inside of another table and moves to parent table
                        //Make the firstTarget the TD of the parent table.
                        this.firstTarget = this.editor.getElementAtCursor(
                            TABLE_CELL_SELECTOR,
                            eventTarget
                        );
                        (this.firstTarget as HTMLElement)
                            .querySelectorAll('table')
                            .forEach(table => {
                                const vTable = new VTable(table);
                                vTable.forEachCell(cell => vTable.highlightCellHandler(cell.td));
                            });
                    }
                    const td = this.editor.getElementAtCursor(
                        TABLE_CELL_SELECTOR,
                        eventTarget
                    ) as HTMLTableCellElement;

                    if (table && td) {
                        setTableSelectedRange(
                            table,
                            firstTableTD ?? (this.firstTarget as HTMLElement),
                            td
                        );

                        range.setStart(td, 0);
                        range.setEnd(td, 0);
                    }

                    event.preventDefault();
                }
            } else if (eventTarget == this.firstTarget) {
                if (range && range.commonAncestorContainer.nodeType != Node.TEXT_NODE) {
                    setTableSelectedRange(table, firstTableTD, firstTableTD);
                    event.preventDefault();
                }
            }
        } else {
            if (event.target != this.lastTarget || (eventTarget as HTMLTableCellElement)) {
                this.highlightSelection();
            }
        }

        this.firstTarget = this.firstTarget || eventTarget;
        this.firstTarget =
            this.editor.getElementAtCursor(TABLE_CELL_SELECTOR, this.firstTarget) ||
            this.firstTarget;
        this.lastTarget = isIDPartSelector(eventTarget as HTMLElement)
            ? this.lastTarget
            : eventTarget;
    };

    private prepareSelection(eventTarget: Node, firstTable: HTMLElement, targetTable: HTMLElement) {
        let isNewTargetTableContained =
            eventTarget != this.firstTarget &&
            firstTable?.contains(findClosestElementAncestor(targetTable, firstTable, 'TD'));

        if (isNewTargetTableContained && this.vSelection) {
            while (isNewTargetTableContained) {
                eventTarget = findClosestElementAncestor(targetTable, firstTable, 'TD');
                targetTable = this.editor.getElementAtCursor('table', eventTarget);
                isNewTargetTableContained =
                    eventTarget != this.firstTarget &&
                    firstTable?.contains(findClosestElementAncestor(targetTable, firstTable, 'TD'));
            }
        }

        let isFirstTargetTableContained =
            eventTarget != this.firstTarget &&
            targetTable?.contains(findClosestElementAncestor(firstTable, targetTable, 'TD'));

        if (isFirstTargetTableContained && this.vSelection) {
            while (isFirstTargetTableContained) {
                this.firstTarget = findClosestElementAncestor(firstTable, targetTable, 'TD');
                firstTable = this.editor.getElementAtCursor('table', this.firstTarget);
                isFirstTargetTableContained =
                    eventTarget != this.firstTarget &&
                    targetTable?.contains(
                        findClosestElementAncestor(firstTable, targetTable, 'TD')
                    );
            }
        }
        return { eventTarget, firstTable, targetTable };
    }

    private highlightSelection() {
        const range = this.editor.getSelectionRange();

        if (this.vSelection && this.firstTarget) {
            range.setStart(this.firstTarget, 0);
            this.vSelection = false;
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
            if (!this.vSelection) {
                // const range = this.editor.getSelectionRange();
                // if (safeInstanceOf(this.firstTarget, 'HTMLTableCellElement')) {
                //     const row = this.editor.getElementAtCursor('tr,th', this.firstTarget);
                //     if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                //         range.setStartBefore(row.cells[0]);
                //     }
                // }
                // if (safeInstanceOf(this.lastTarget, 'HTMLTableCellElement')) {
                //     const row = this.editor.getElementAtCursor('tr,th', this.lastTarget);
                //     if (safeInstanceOf(row, 'HTMLTableRowElement')) {
                //         range.setEndAfter(row.cells[row.cells.length - 1]);
                //     }
                // }
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
            const rows = Array.from(table.querySelectorAll('tr,th'));

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

function isIDPartSelector(element: HTMLElement) {
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
