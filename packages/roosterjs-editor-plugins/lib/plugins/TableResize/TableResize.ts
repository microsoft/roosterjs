import { createElement, getComputedStyle, normalizeRect, VTable } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    CreateElementData,
    EditorPlugin,
    IEditor,
    KnownCreateElementDataIndex,
    PluginEvent,
    PluginEventType,
    Rect,
    TableOperation,
} from 'roosterjs-editor-types';

const INSERTER_COLOR = '#4A4A4A';
const INSERTER_COLOR_DARK_MODE = 'white';
const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;
const INSERTER_HOVER_OFFSET = 5;
const MIN_CELL_WIDTH = 30;
const MIN_CELL_HEIGHT = 20;
const CELL_RESIZER_WIDTH = 4;
const TABLE_RESIZER_LENGTH = 12;

const HORIZONTAL_INSERTER_ID = 'horizontalInserter';
const VERTICAL_INSERTER_ID = 'verticalInserter';
const HORIZONTAL_RESIZER_ID = 'horizontalResizer';
const VERTICAL_RESIZER_ID = 'verticalResizer';
const TABLE_RESIZER_ID = 'tableResizer';

const enum ResizeState {
    None,
    Horizontal,
    Vertical,
    Both, // when resizing the whole table
}

function getHorizontalDistance(rect: Rect, pos: number, toLeft: boolean): number {
    return toLeft ? pos - rect.left : rect.right - pos;
}

/**
 * TableResize plugin, provides the ability to resize a table by drag-and-drop
 */
export default class TableResize implements EditorPlugin {
    private editor: IEditor;
    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private resizerContainer: HTMLDivElement;
    private tableResizerContainer: HTMLDivElement;
    private currentTable: HTMLTableElement;
    private currentTd: HTMLTableCellElement;
    private currentCellsToResize: HTMLTableCellElement[] = [];
    private nextCellsToResize: HTMLTableCellElement[] = [];
    private horizontalResizer: HTMLDivElement;
    private verticalResizer: HTMLDivElement;
    private tableResizer: HTMLDivElement;
    private resizingState: ResizeState = ResizeState.None;

    private currentInsertTd: HTMLTableCellElement;
    private insertingState: ResizeState = ResizeState.None;
    private inserter: HTMLDivElement;
    private isRTL: boolean;

    private currentTableVerticalBorder: number;
    private currentTableHorizontalBorder: number;
    private resizingVtable: VTable;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableResize';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.setupResizerContainer();
        this.onMouseMoveDisposer = this.editor.addDomEventHandler({ mousemove: this.onMouseMove });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.tableRectMap = null;
        this.removeResizerContainer();
        this.setCurrentTable(null);
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.Input:
            case PluginEventType.ContentChanged:
            case PluginEventType.Scroll:
                this.setTableResizer(null);
                this.tableRectMap = null;
                break;
        }
    }

    private setupResizerContainer() {
        const document = this.editor.getDocument();
        this.resizerContainer = document.createElement('div');
        this.editor.insertNode(this.resizerContainer, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });

        this.tableResizerContainer = document.createElement('div');
        this.editor.insertNode(this.tableResizerContainer, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });
    }

    private removeResizerContainer() {
        this.resizerContainer?.parentNode?.removeChild(this.resizerContainer);
        this.resizerContainer = null;
        this.tableResizerContainer?.parentNode?.removeChild(this.tableResizerContainer);
        this.tableResizerContainer = null;
    }

    private onMouseOutInserter = () => {
        this.setCurrentInsertTd(ResizeState.None);
    };

    private onMouseMove = (e: MouseEvent) => {
        if (this.resizingState != ResizeState.None) {
            return;
        }

        if (!this.tableRectMap) {
            this.cacheRects();
        }

        if (this.tableRectMap) {
            this.setCurrentTable(null);

            for (let i = this.tableRectMap.length - 1; i >= 0; i--) {
                const { table, rect } = this.tableRectMap[i];

                if (
                    e.pageX <=
                        rect.right + (this.isRTL ? INSERTER_SIDE_LENGTH : TABLE_RESIZER_LENGTH) &&
                    e.pageX >=
                        rect.left - (this.isRTL ? TABLE_RESIZER_LENGTH : INSERTER_SIDE_LENGTH) &&
                    e.pageY >= rect.top - INSERTER_SIDE_LENGTH &&
                    e.pageY <= rect.bottom + TABLE_RESIZER_LENGTH
                ) {
                    this.setCurrentTable(table);
                    break;
                }
            }

            if (this.currentTable) {
                const map = this.tableRectMap.filter(map => map.table == this.currentTable)[0];
                this.setTableResizer(map.rect);
                for (let i = 0; i < this.currentTable.rows.length; i++) {
                    const tr = this.currentTable.rows[i];
                    let j = 0;
                    for (; j < tr.cells.length; j++) {
                        const td = tr.cells[j];
                        const tdRect = normalizeRect(td.getBoundingClientRect());

                        if (
                            tdRect &&
                            (this.isRTL ? e.pageX >= tdRect.left : e.pageX <= tdRect.right) &&
                            e.pageY <= tdRect.bottom
                        ) {
                            // check vertical inserter
                            if (
                                i == 0 &&
                                e.pageY >= tdRect.top - INSERTER_HOVER_OFFSET &&
                                e.pageY <= tdRect.top + INSERTER_HOVER_OFFSET
                            ) {
                                let verticalInserterTd: HTMLTableCellElement = null;
                                // set inserter at current td
                                if (
                                    this.isRTL
                                        ? e.pageX <=
                                          tdRect.left + (tdRect.right - tdRect.left) / 2.0
                                        : e.pageX >=
                                          tdRect.left + (tdRect.right - tdRect.left) / 2.0
                                ) {
                                    verticalInserterTd = td;
                                } else if (
                                    this.isRTL ? e.pageX <= tdRect.right : e.pageX >= tdRect.left
                                ) {
                                    // set inserter at previous td if it exists
                                    const preTd = td.previousElementSibling as HTMLTableCellElement;
                                    if (preTd) {
                                        verticalInserterTd = preTd;
                                    }
                                }
                                if (verticalInserterTd) {
                                    this.setCurrentTd(null);
                                    // we hide the inserter if left mouse button is pressed
                                    if (e.buttons == 0) {
                                        this.setCurrentInsertTd(
                                            ResizeState.Vertical,
                                            verticalInserterTd,
                                            map.rect
                                        );
                                    }
                                    break;
                                }
                                // check horizontal inserter
                            } else if (
                                j == 0 &&
                                (this.isRTL
                                    ? e.pageX >= tdRect.right - INSERTER_HOVER_OFFSET
                                    : e.pageX <= tdRect.left + INSERTER_HOVER_OFFSET)
                            ) {
                                let horizontalInserterTd: HTMLTableCellElement = null;
                                // set inserter at current td
                                if (e.pageY >= tdRect.top + (tdRect.bottom - tdRect.top) / 2.0) {
                                    horizontalInserterTd = td;
                                } else if (e.pageY >= tdRect.top) {
                                    // set insert at previous td if it exists
                                    const preTd = this.currentTable.rows[i - 1]?.cells[0];
                                    if (preTd) {
                                        horizontalInserterTd = preTd;
                                    }
                                }

                                if (horizontalInserterTd) {
                                    this.setCurrentTd(null);
                                    // we hide the inserter if left mouse button is pressed
                                    if (e.buttons == 0) {
                                        this.setCurrentInsertTd(
                                            ResizeState.Horizontal,
                                            horizontalInserterTd,
                                            map.rect
                                        );
                                    }
                                    break;
                                }
                            } else {
                                this.setCurrentTd(
                                    td,
                                    map.rect,
                                    this.isRTL ? tdRect.left : tdRect.right,
                                    tdRect.bottom
                                );
                                this.setCurrentInsertTd(ResizeState.None);
                                break;
                            }
                        }
                    }
                    if (j < tr.cells.length) {
                        break;
                    }
                }
            } else {
                this.setTableResizer(null);
            }
        }
    };

    private setCurrentInsertTd(insertingState: ResizeState.None): void;
    private setCurrentInsertTd(
        insertingState: ResizeState,
        td: HTMLTableCellElement,
        tableRect: Rect
    ): void;
    private setCurrentInsertTd(
        insertingState: ResizeState,
        td?: HTMLTableCellElement,
        tableRect?: Rect
    ) {
        if (td != this.currentInsertTd || insertingState != this.insertingState) {
            if (this.currentInsertTd) {
                this.inserter?.parentNode?.removeChild(this.inserter);
                this.inserter = null;
            }
            this.insertingState = insertingState;
            this.currentInsertTd = td;
            if (this.currentInsertTd) {
                this.inserter = this.createInserter(tableRect);
                this.resizerContainer.appendChild(this.inserter);
            }
        }
    }

    private createInserter(tableRect: Rect) {
        if (this.insertingState == ResizeState.None) {
            return undefined;
        }

        const rect = normalizeRect(this.currentInsertTd.getBoundingClientRect());
        const editorBackgroundColor = this.editor.getDefaultFormat().backgroundColor;
        const inserterBackgroundColor = editorBackgroundColor || 'white';
        const inserterColor = this.editor.isDarkMode() ? INSERTER_COLOR_DARK_MODE : INSERTER_COLOR;
        const leftOrRight = this.isRTL ? 'right' : 'left';
        const outerDivStyle = `position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${inserterColor}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${inserterColor}; border-radius: 50%; background-color: ${inserterBackgroundColor}`;
        const HORIZONTAL_INSERTER: CreateElementData = {
            tag: 'div',
            style: outerDivStyle,
            children: [
                {
                    tag: 'div',
                    style: `position: absolute; ${leftOrRight}: 12px; top: 5px; height: 3px; border-top: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-left: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor};`,
                },
                '+',
            ],
        };
        const VERTICAL_INSERTER: CreateElementData = {
            tag: 'div',
            style: outerDivStyle,
            children: [
                {
                    tag: 'div',
                    style: `position: absolute; left: 5px; top: 12px; width: 3px; border-left: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-top: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor}`,
                },
                '+',
            ],
        };

        const inserter = createElement(
            this.insertingState == ResizeState.Horizontal ? HORIZONTAL_INSERTER : VERTICAL_INSERTER,
            this.editor.getDocument()
        ) as HTMLDivElement;

        inserter.id =
            this.insertingState == ResizeState.Horizontal
                ? HORIZONTAL_INSERTER_ID
                : VERTICAL_INSERTER_ID;
        // set inserter position
        if (rect) {
            if (this.insertingState == ResizeState.Horizontal) {
                if (this.isRTL) {
                    inserter.style.left = `${rect.right}px`;
                } else {
                    inserter.style.left = `${
                        rect.left - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
                    }px`;
                }
                inserter.style.top = `${rect.bottom - 8}px`;
                (inserter.firstChild as HTMLElement).style.width = `${
                    tableRect.right - tableRect.left
                }px`;
            } else {
                if (this.isRTL) {
                    inserter.style.left = `${rect.left - 8}px`;
                } else {
                    inserter.style.left = `${rect.right - 8}px`;
                }
                inserter.style.top = `${
                    rect.top - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
                }px`;
                (inserter.firstChild as HTMLElement).style.height = `${
                    tableRect.bottom - tableRect.top
                }px`;
            }
        }

        inserter.addEventListener('click', this.insertTd);
        inserter.addEventListener('mouseout', this.onMouseOutInserter);

        return inserter;
    }

    private insertTd = () => {
        let vtable = new VTable(this.currentInsertTd);
        if (this.insertingState === ResizeState.Vertical) {
            vtable.normalizeTableCellSize();
            // Since adding new column will cause table width to change, we need to remove width properties
            vtable.table.removeAttribute('width');
            vtable.table.style.width = null;
        }
        this.editor.addUndoSnapshot((start, end) => {
            vtable.edit(
                this.insertingState == ResizeState.Horizontal
                    ? TableOperation.InsertBelow
                    : TableOperation.InsertRight
            );
            vtable.writeBack();
            this.editor.select(start, end);
            this.setCurrentInsertTd(ResizeState.None);
            // need to update the position of table resizer as new row/column has been added
            if (this.currentTable) {
                const rect = normalizeRect(this.currentTable.getBoundingClientRect());
                this.setTableResizer(rect);
            }
        }, ChangeSource.Format);
    };

    private setCurrentTable(table: HTMLTableElement) {
        if (this.currentTable != table) {
            this.setCurrentTd(null);
            this.setCurrentInsertTd(ResizeState.None);
            this.currentTable = table;
        }
    }

    private setCurrentTd(td: null): void;
    private setCurrentTd(
        td: HTMLTableCellElement,
        tableRect: Rect,
        resizerPosX: number,
        bottom: number
    ): void;
    private setCurrentTd(
        td: HTMLTableCellElement,
        tableRect?: Rect,
        resizerPosX?: number,
        bottom?: number
    ) {
        if (this.currentTd != td) {
            if (this.currentTd) {
                this.horizontalResizer?.parentNode?.removeChild(this.horizontalResizer);
                this.verticalResizer?.parentNode?.removeChild(this.verticalResizer);
                this.horizontalResizer = null;
                this.verticalResizer = null;
            }

            this.currentTd = td;

            if (this.currentTd) {
                this.horizontalResizer = this.createCellsResizer(
                    true /*horizontal*/,
                    tableRect.left,
                    bottom - CELL_RESIZER_WIDTH + 1,
                    tableRect.right - tableRect.left,
                    CELL_RESIZER_WIDTH
                );
                this.verticalResizer = this.createCellsResizer(
                    false /*horizontal*/,
                    resizerPosX - CELL_RESIZER_WIDTH + 1,
                    tableRect.top,
                    CELL_RESIZER_WIDTH,
                    tableRect.bottom - tableRect.top
                );

                this.resizerContainer.appendChild(this.horizontalResizer);
                this.resizerContainer.appendChild(this.verticalResizer);
            }
        }
    }

    private setTableResizer(rect: Rect | null): void {
        // remove old one if exists
        while (this.tableResizerContainer?.hasChildNodes()) {
            this.tableResizerContainer.removeChild(this.tableResizerContainer.lastChild);
        }
        this.tableResizer = null;
        // add new one if exists
        if (rect) {
            this.tableResizer = this.createTableResizer(rect);
            this.tableResizerContainer.appendChild(this.tableResizer);
        }
    }

    private createTableResizer(rect: Rect): HTMLDivElement {
        const div = createElement(
            this.isRTL
                ? KnownCreateElementDataIndex.TableResizerRTL
                : KnownCreateElementDataIndex.TableResizerLTR,
            this.editor.getDocument()
        ) as HTMLDivElement;

        div.id = TABLE_RESIZER_ID;
        div.style.top = `${rect.bottom}px`;
        div.style.left = this.isRTL
            ? `${rect.left - TABLE_RESIZER_LENGTH - 2}px`
            : `${rect.right}px`;
        div.style.width = `${TABLE_RESIZER_LENGTH}px`;
        div.style.height = `${TABLE_RESIZER_LENGTH}px`;

        div.addEventListener('mousedown', this.startResizingTable);

        return div;
    }

    private createCellsResizer(
        horizontal: boolean,
        left: number,
        top: number,
        width: number,
        height: number
    ): HTMLDivElement {
        const div = createElement(
            horizontal
                ? KnownCreateElementDataIndex.TableHorizontalResizer
                : KnownCreateElementDataIndex.TableVerticalResizer,
            this.editor.getDocument()
        ) as HTMLDivElement;
        div.id = horizontal ? HORIZONTAL_RESIZER_ID : VERTICAL_RESIZER_ID;
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;

        div.addEventListener(
            'mousedown',
            horizontal ? this.startHorizontalResizeCells : this.startVerticalResizeCells
        );

        return div;
    }

    private startResizingTable = (e: MouseEvent) => {
        if (!this.currentTable) {
            return;
        }
        this.resizingVtable = new VTable(
            this.currentTable,
            true /* normalize the table for resizing */
        );
        this.resizingState = ResizeState.Both;

        const rect = this.resizingVtable.table.getBoundingClientRect();
        this.currentTableVerticalBorder = this.isRTL ? rect.left : rect.right;
        this.currentTableHorizontalBorder = rect.bottom;

        this.startResizeCells(e);
    };

    private startHorizontalResizeCells = (e: MouseEvent) => {
        if (!this.currentTd) {
            return;
        }
        this.resizingVtable = new VTable(
            this.currentTd,
            true /* normalize the table for resizing */
        );
        this.resizingState = ResizeState.Horizontal;
        this.startResizeCells(e);
    };

    private startVerticalResizeCells = (e: MouseEvent) => {
        if (!this.currentTd) {
            return;
        }
        this.resizingVtable = new VTable(
            this.currentTd,
            true /* normalize the table for resizing */
        );
        this.resizingState = ResizeState.Vertical;
        if (this.resizingVtable) {
            const rect = normalizeRect(this.currentTd.getBoundingClientRect());

            // calculate and retrieve the cells of the two columns shared by the current vertical resizer
            this.currentCellsToResize = this.resizingVtable.getCellsWithBorder(
                this.isRTL ? rect.left : rect.right,
                !this.isRTL
            );

            this.nextCellsToResize = this.resizingVtable.getCellsWithBorder(
                this.isRTL ? rect.left : rect.right,
                this.isRTL
            );
        }
        this.startResizeCells(e);
    };

    private startResizeCells(e: MouseEvent) {
        const doc = this.editor.getDocument();
        doc.addEventListener('mousemove', this.frameAnimateResizeCells, true);
        doc.addEventListener('mouseup', this.endResizeCells, true);
    }

    private frameAnimateResizeCells = (e: MouseEvent) => {
        this.editor.runAsync(() => this.resizeCells(e));
    };

    private resizeTable = (mouseX: number, mouseY: number) => {
        const rect = normalizeRect(this.resizingVtable.table.getBoundingClientRect());
        const ratioX =
            1.0 +
            (this.isRTL
                ? (this.currentTableVerticalBorder - mouseX) /
                  (rect.right - this.currentTableVerticalBorder)
                : (mouseX - this.currentTableVerticalBorder) /
                  (this.currentTableVerticalBorder - rect.left));
        const ratioY =
            1.0 +
            (mouseY - this.currentTableHorizontalBorder) /
                (this.currentTableHorizontalBorder - rect.top);

        const shouldResizeX = Math.abs(ratioX - 1.0) > 1e-3;
        const shouldResizeY = Math.abs(ratioY - 1.0) > 1e-3;
        if (shouldResizeX || shouldResizeY) {
            for (let i = 0; i < this.resizingVtable.cells.length; i++) {
                for (let j = 0; j < this.resizingVtable.cells[i].length; j++) {
                    const cell = this.resizingVtable.cells[i][j];
                    if (cell.td) {
                        if (shouldResizeX) {
                            // the width of some external table is fixed, we need to make it resizable
                            this.resizingVtable.table.style.width = null;
                            const newWidth = cell.width * ratioX;
                            cell.td.style.boxSizing = 'border-box';
                            if (newWidth >= MIN_CELL_WIDTH) {
                                cell.td.style.wordBreak = 'break-word';
                                cell.td.style.whiteSpace = 'normal';
                                cell.td.style.width = `${newWidth}px`;
                            }
                        }

                        if (shouldResizeY) {
                            // the height of some external table is fixed, we need to make it resizable
                            this.resizingVtable.table.style.height = null;
                            if (j == 0) {
                                const newHeight = cell.height * ratioY;
                                if (newHeight >= MIN_CELL_HEIGHT) {
                                    cell.td.style.height = `${newHeight}px`;
                                }
                            } else {
                                cell.td.style.height = null;
                            }
                        }
                    }
                }
            }
        }
        return;
    };

    private resizeRows = (newPos: number, rect: Rect) => {
        this.resizingVtable.table.removeAttribute('height');
        this.resizingVtable.table.style.height = null;
        this.resizingVtable.forEachCellOfCurrentRow(cell => {
            if (cell.td) {
                cell.td.style.height = cell.td == this.currentTd ? `${newPos - rect.top}px` : null;
            }
        });
    };

    /**
     *
     * @param newPos The position to where we want to move the vertical border
     * @returns if the move is allowed, or, if any of the cells on either side of the vertical border is smaller than
     * the minimum width, such move is not allowed
     */
    private canResizeColumns = (newPos: number): boolean => {
        for (let i = 0; i < this.currentCellsToResize.length; i++) {
            const td = this.currentCellsToResize[i];
            const rect = normalizeRect(td.getBoundingClientRect());
            const width = getHorizontalDistance(rect, newPos, !this.isRTL);
            if (width < MIN_CELL_WIDTH) {
                return false;
            }
        }

        for (let i = 0; i < this.nextCellsToResize.length; i++) {
            const td = this.nextCellsToResize[i];
            let width: number = Number.MAX_SAFE_INTEGER;
            if (td) {
                const rect = normalizeRect(td.getBoundingClientRect());
                width = getHorizontalDistance(rect, newPos, this.isRTL);
            }

            if (width < MIN_CELL_WIDTH) {
                return false;
            }
        }
        return true;
    };

    private resizeColumns = (newPos: number, isShiftPressed: boolean) => {
        if (!this.canResizeColumns(newPos)) {
            return;
        }

        // Since we allow the user to resize the table width on adjusting the border of the last cell,
        // we need to make the table width resizable by setting it as null;
        // We also allow the user to resize the table width if Shift key is pressed
        const isLastCell: boolean = this.nextCellsToResize.length == 0;

        if (isLastCell || isShiftPressed) {
            this.resizingVtable.table.style.width = null;
        }

        const newWidthList: Map<HTMLTableCellElement, number> = new Map();
        this.currentCellsToResize.forEach(td => {
            const rect = normalizeRect(td.getBoundingClientRect());
            td.style.wordBreak = 'break-word';
            td.style.whiteSpace = 'normal';
            td.style.boxSizing = 'border-box';
            const newWidth = getHorizontalDistance(rect, newPos, !this.isRTL);
            newWidthList.set(td, newWidth);
        });

        newWidthList.forEach((newWidth, td) => {
            td.style.width = `${newWidth}px`;
        });

        this.nextCellsToResize.forEach(td => {
            if (!isShiftPressed) {
                td.style.wordBreak = 'break-word';
                td.style.whiteSpace = 'normal';
                td.style.boxSizing = 'border-box';
                td.style.width = null;
            }
        });
    };

    private resizeCells = (e: MouseEvent) => {
        this.setTableResizer(null);
        if (this.resizingState === ResizeState.None) {
            return;
        } else if (this.resizingState === ResizeState.Both) {
            this.resizeTable(e.pageX, e.pageY);
            this.resizingVtable.writeBack();
        } else if (this.currentTd) {
            const rect = normalizeRect(this.currentTd.getBoundingClientRect());
            if (rect) {
                const newPos = this.resizingState == ResizeState.Horizontal ? e.pageY : e.pageX;
                if (this.resizingState === ResizeState.Horizontal) {
                    this.resizeRows(newPos, rect);
                } else {
                    this.resizeColumns(newPos, e.shiftKey);
                }
                this.resizingVtable.writeBack();
            }
        }
    };

    private endResizeCells = (e: MouseEvent) => {
        const doc = this.editor.getDocument();
        doc.removeEventListener('mousemove', this.frameAnimateResizeCells, true);
        doc.removeEventListener('mouseup', this.endResizeCells, true);
        this.currentCellsToResize = [];
        this.nextCellsToResize = [];

        this.editor.addUndoSnapshot((start, end) => {
            this.frameAnimateResizeCells(e);
            this.editor.select(start, end);
        }, ChangeSource.Format);

        this.setCurrentTd(null);
        this.setTableResizer(null);

        this.resizingVtable = null;
        this.resizingState = ResizeState.None;
    };

    private cacheRects() {
        this.tableRectMap = [];
        const tables = this.editor.getDocument().getElementsByTagName('table');
        const tableList = Array.from(tables);
        tableList.forEach(table => {
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
        this.isRTL = getComputedStyle(this.editor.getDocument().body, 'direction') == 'rtl';
    }
}
