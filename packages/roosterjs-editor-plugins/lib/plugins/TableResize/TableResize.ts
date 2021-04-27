import { fromHtml, getComputedStyle, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { traceDeprecation } from 'node:process';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    Rect,
    ChangeSource,
    TableOperation,
    ContentPosition,
} from 'roosterjs-editor-types';

const INSERTER_COLOR = '#4A4A4A';
const INSERTER_COLOR_DARK_MODE = 'white';
const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;
const INSERTER_HOVER_OFFSET = 5;

const CELL_RESIZER_WIDTH = 4;
const HORIZONTAL_RESIZER_HTML =
    '<div style="position: fixed; cursor: row-resize; user-select: none"></div>';
const VERTICAL_RESIZER_HTML =
    '<div style="position: fixed; cursor: col-resize; user-select: none"></div>';

const enum ResizeState {
    None,
    Horizontal,
    Vertical,
}

/**
 * TableResize plugin, provides the ability to resize a table by drag-and-drop
 */
export default class TableResize implements EditorPlugin {
    private editor: IEditor;
    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private resizerContainer: HTMLDivElement;
    private currentTable: HTMLTableElement;
    private currentTd: HTMLTableCellElement;
    private currentCellsToResize: HTMLTableCellElement[] = [];
    private nextCellsToResize: HTMLTableCellElement[] = [];
    private horizontalResizer: HTMLDivElement;
    private verticalResizer: HTMLDivElement;
    private resizingState: ResizeState = ResizeState.None;

    private currentInsertTd: HTMLTableCellElement;
    private insertingState: ResizeState = ResizeState.None;
    private inserter: HTMLDivElement;
    private isRTL: boolean;

    private isLeftMouseDown: boolean = false;

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
        this.onMouseMoveDisposer = this.editor.addDomEventHandler('mousemove', this.onMouseMove);
        this.editor.addDomEventHandler('mousedown', this.onMouseDown);
        this.editor.addDomEventHandler('mouseup', this.onMouseUp);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.destoryRectMap();
        this.removeResizerContainer();

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
                this.destoryRectMap();
                break;
        }
    }

    private onMouseDown = (e: MouseEvent) => {
        if (e.button === 0) {
            this.isLeftMouseDown = true;
        }
    };

    private onMouseUp = (e: MouseEvent) => {
        this.isLeftMouseDown = false;
    };

    private setupResizerContainer() {
        this.resizerContainer = this.editor.getDocument().createElement('div');
        this.editor.insertNode(this.resizerContainer, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });
    }

    private removeResizerContainer() {
        this.resizerContainer.parentNode.removeChild(this.resizerContainer);
        this.resizerContainer = null;
    }

    private onMouseMove = (e: MouseEvent) => {
        if (this.resizingState != ResizeState.None) {
            return;
        }

        if (!this.tableRectMap) {
            this.cacheRects();
        }

        if (this.tableRectMap) {
            let i = this.tableRectMap.length - 1;
            for (; i >= 0; i--) {
                const { table, rect } = this.tableRectMap[i];

                if (
                    e.pageX <= rect.right + (this.isRTL ? INSERTER_SIDE_LENGTH : 0) &&
                    e.pageX >= rect.left - (this.isRTL ? 0 : INSERTER_SIDE_LENGTH) &&
                    e.pageY >= rect.top - INSERTER_SIDE_LENGTH &&
                    e.pageY <= rect.bottom
                ) {
                    this.setCurrentTable(table, rect);
                    break;
                }
            }

            if (i < 0) {
                this.setCurrentTable(null);
            }

            if (this.currentTable) {
                const map = this.tableRectMap.filter(map => map.table == this.currentTable)[0];

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
                            // check vertical isnerter
                            if (i == 0 && e.pageY <= tdRect.top + INSERTER_HOVER_OFFSET) {
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
                                    if (!this.isLeftMouseDown) {
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
                                    if (!this.isLeftMouseDown) {
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
                this.resizerContainer.removeChild(this.inserter);
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
            return;
        }

        const rect = normalizeRect(this.currentInsertTd.getBoundingClientRect());
        const editorBackgroundColor = this.editor.getDefaultFormat().backgroundColor;
        const inserterBackgroundColor = editorBackgroundColor || 'white';
        const inserterColor = this.editor.isDarkMode() ? INSERTER_COLOR_DARK_MODE : INSERTER_COLOR;
        const leftOrRight = this.isRTL ? 'right' : 'left';

        const HORIZONTAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${inserterColor}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${inserterColor}; border-radius: 50%; background-color: ${inserterBackgroundColor}"><div style="position: absolute; ${leftOrRight}: 12px; top: 5px; height: 3px; border-top: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-left: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor};"></div>+</div>`;
        const VERTICAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${inserterColor}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${inserterColor}; border-radius: 50%; background-color: ${inserterBackgroundColor}"><div style="position: absolute; left: 5px; top: 12px; width: 3px; border-left: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-top: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor};"></div>+</div>`;

        const inserter = fromHtml(
            this.insertingState == ResizeState.Horizontal
                ? HORIZONTAL_INSERTER_HTML
                : VERTICAL_INSERTER_HTML,
            this.editor.getDocument()
        )[0] as HTMLDivElement;

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

        return inserter;
    }

    private insertTd = () => {
        this.editor.addUndoSnapshot((start, end) => {
            const vtable = new VTable(this.currentInsertTd);
            vtable.edit(
                this.insertingState == ResizeState.Horizontal
                    ? TableOperation.InsertBelow
                    : TableOperation.InsertRight
            );
            vtable.writeBack();
            this.editor.select(start, end);
            this.setCurrentInsertTd(ResizeState.None);
        }, ChangeSource.Format);
    };

    private setCurrentTable(table: HTMLTableElement, rect: Rect): void;
    private setCurrentTable(table: null): void;
    private setCurrentTable(table: HTMLTableElement, rect?: Rect) {
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
                this.resizerContainer.removeChild(this.horizontalResizer);
                this.resizerContainer.removeChild(this.verticalResizer);
                this.horizontalResizer = null;
                this.verticalResizer = null;
            }

            this.currentTd = td;

            if (this.currentTd) {
                this.horizontalResizer = this.createResizer(
                    true /*horizontal*/,
                    tableRect.left,
                    bottom - CELL_RESIZER_WIDTH + 1,
                    tableRect.right - tableRect.left,
                    CELL_RESIZER_WIDTH
                );
                this.verticalResizer = this.createResizer(
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

    private createResizer(
        horizontal: boolean,
        left: number,
        top: number,
        width: number,
        height: number
    ) {
        const div = fromHtml(
            horizontal ? HORIZONTAL_RESIZER_HTML : VERTICAL_RESIZER_HTML,
            this.editor.getDocument()
        )[0] as HTMLDivElement;
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;

        div.addEventListener(
            'mousedown',
            horizontal ? this.startHorizontalResizeTable : this.startVerticalResizeTable
        );

        return div;
    }

    private startHorizontalResizeTable = (e: MouseEvent) => {
        this.resizingState = ResizeState.Horizontal;
        this.startResizeTable(e);
    };

    private startVerticalResizeTable = (e: MouseEvent) => {
        this.resizingState = ResizeState.Vertical;

        const vtable = new VTable(this.currentTd);
        if (vtable) {
            const rect = normalizeRect(this.currentTd.getBoundingClientRect());

            // calculate and retrieve the cells of the two columns shared by the current vertical resizer
            this.currentCellsToResize = vtable.getCellsWithBorder(
                this.isRTL ? rect.left : rect.right,
                !this.isRTL
            );

            //this.currentCellsToResize = vtable.getCellsWithBorder(rect.left, false);

            this.nextCellsToResize = vtable.getCellsWithBorder(
                this.isRTL ? rect.left : rect.right,
                this.isRTL
            );
        }

        this.startResizeTable(e);
    };

    private startResizeTable(e: MouseEvent) {
        const doc = this.editor.getDocument();
        doc.addEventListener('mousemove', this.frameAnimateResizeTable, true);
        doc.addEventListener('mouseup', this.endResizeTable, true);
    }

    private frameAnimateResizeTable = (e: MouseEvent) => {
        this.editor.runAsync(() => this.resizeTable(e));
    };

    // get the total width of padding-left, padding-right and border-width of the cell
    private getTdOffsetWidth = (td: HTMLTableCellElement): number => {
        /*return (
            parseInt(this.currentTable.cellPadding) * 2 +
            parseInt(td.style.borderWidth.slice(0, -2))
        );*/
        return 1;
    };

    private resizeTable = (e: MouseEvent) => {
        if (this.currentTd && this.resizingState !== ResizeState.None) {
            const rect = normalizeRect(this.currentTd.getBoundingClientRect());

            if (rect) {
                const newPos = this.resizingState == ResizeState.Horizontal ? e.pageY : e.pageX;

                let vtable = new VTable(this.currentTd);

                if (this.resizingState == ResizeState.Horizontal) {
                    vtable.table.style.height = null;
                    vtable.forEachCellOfCurrentRow(cell => {
                        if (cell.td) {
                            cell.td.style.height =
                                cell.td == this.currentTd ? `${newPos - rect.top}px` : null;
                        }
                    });
                } else {
                    let leftBoundary: number;
                    let rightBoundary: number;

                    if (this.isRTL) {
                        leftBoundary =
                            this.nextCellsToResize.length > 0
                                ? parseInt(
                                      this.nextCellsToResize[0].getAttribute('originalLeftBorder')
                                  )
                                : 0;
                        rightBoundary = parseInt(
                            this.currentCellsToResize[0].getAttribute('originalRightBorder')
                        );
                    } else {
                        leftBoundary = parseInt(
                            this.currentCellsToResize[0].getAttribute('originalLeftBorder')
                        );
                        rightBoundary =
                            this.nextCellsToResize.length > 0
                                ? parseInt(
                                      this.nextCellsToResize[0].getAttribute('originalRightBorder')
                                  )
                                : Number.MAX_SAFE_INTEGER;
                    }

                    if (newPos <= leftBoundary + 50) {
                        return;
                    }

                    /*this.currentCellsToResize.forEach(td => {
                        console.log('***** current td: ' + td.textContent);
                        const rect = normalizeRect(td.getBoundingClientRect());
                        td.style.wordBreak = 'break-word';
                        const offset = this.getTdOffsetWidth(td);
                        const newWidth = newPos - rect.left - offset;
                        td.style.width = this.isRTL
                            ? `${rect.right - newPos - offset}px`
                            : `${newPos - rect.left - offset}px`;
                    });*/

                    /*vtable.forEachCellOfCurrentColumn(cell => {
                        if (cell.td) {
                            console.log('***** current td: ' + cell.td.textContent);
                            const offset = this.getTdOffsetWidth(cell.td);
                            cell.td.style.wordBreak = 'break-word';
                            cell.td.style.width =
                                cell.td == this.currentTd
                                    ? `${newPos - rect.left - offset}px`
                                    : null;
                        }
                    });*/

                    /*this.nextCellsToResize.forEach(td => {
                        td.style.wordBreak = 'break-word';
                        const offset = this.getTdOffsetWidth(td);
                        const tdWidth = this.isRTL
                            ? newPos - parseInt(td.getAttribute('originalLeftBorder'))
                            : parseInt(td.getAttribute('originalRightBorder')) - newPos;
                        td.style.width = `${tdWidth - offset}px`;
                    });*/

                    /*vtable.forEachCellOfCurrentColumn(cell => {
                        if (cell.td) {
                            cell.td.style.wordBreak = 'break-word';
                            cell.td.style.width =
                                cell.td == this.currentTd ? `${newPos - rect.left}px` : null;
                        }
                    });*/
                }
                vtable.writeBack();
            }
        }
    };

    private endResizeTable = (e: MouseEvent) => {
        const doc = this.editor.getDocument();
        doc.removeEventListener('mousemove', this.frameAnimateResizeTable, true);
        doc.removeEventListener('mouseup', this.endResizeTable, true);
        this.currentCellsToResize = [];
        this.nextCellsToResize = [];

        this.editor.addUndoSnapshot((start, end) => {
            this.frameAnimateResizeTable(e);
            this.editor.select(start, end);
        }, ChangeSource.Format);

        this.setCurrentTd(null);
        this.resizingState = ResizeState.None;
    };

    private destoryRectMap() {
        this.setCurrentTable(null);
        this.tableRectMap = null;
    }

    private cacheRects() {
        this.destoryRectMap();
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
        this.isRTL = getComputedStyle(this.editor.getDocument().body, 'direction') == 'rtl';
        const aa = this.isRTL;
    }
}
