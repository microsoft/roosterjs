import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { fromHtml, normalizeRect, VTable } from 'roosterjs-editor-dom';
// import { editTable } from 'roosterjs/lib';
import {
    ContentPosition,
    PluginEvent,
    PluginEventType,
    Rect,
    ChangeSource,
    TableOperation,
    // TableOperation,
    // PositionType,
} from 'roosterjs-editor-types';

// import { contains, fromHtml, isRtl, VTable } from 'roosterjs-editor-dom';
// import { isNode } from 'roosterjs-cross-window';
// import {
//     ContentPosition,
//     PluginEvent,
//     PluginEventType,
//     PluginMouseEvent,
//     ChangeSource,
// } from 'roosterjs-editor-types';

// const TABLE_RESIZE_HANDLE_KEY = 'TABLE_RESIZE_HANDLE';
// const HANDLE_WIDTH = 6;
// const CONTAINER_HTML = `<div style="position: fixed; cursor: col-resize; width: ${HANDLE_WIDTH}px; border: solid 0 #C6C6C6;"></div>`;

const TABLE_MOVER_WIDTH = 20;
const CELL_RESIZER_WIDTH = 4;
const INSERTER_COLOR = '#4A4A4A';
const MOVE_HANDLE_HTML = `<div style="width: 16px; height: 16px; border: solid 1px #ccc; color: ${INSERTER_COLOR}; border-radius: 2px; line-height: 18px; text-align: center; font-family: Arial; font-weight: bold; font-size: 18px; cursor: all-scroll; background-color: white; position: fixed">+</div>`;

const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;
const HORIZONTAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${INSERTER_COLOR}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${INSERTER_COLOR}; border-radius: 50%; background-color: white"><div style="position: absolute; left: 12px; top: 5px; height: 3px; border-top: 1px solid ${INSERTER_COLOR}; border-bottom: 1px solid ${INSERTER_COLOR}; border-right: 1px solid ${INSERTER_COLOR}; border-left: 0px; box-sizing: border-box; background-color: white;"></div>+</div>`;
const VERTICAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${INSERTER_COLOR}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${INSERTER_COLOR}; border-radius: 50%; background-color: white"><div style="position: absolute; left: 5px; top: 12px; width: 3px; border-left: 1px solid ${INSERTER_COLOR}; border-right: 1px solid ${INSERTER_COLOR}; border-bottom: 1px solid ${INSERTER_COLOR}; border-top: 0px; box-sizing: border-box; background-color: white;"></div>+</div>`;

const HORITONZAL_RESIZER_HTML =
    '<div style="position: fixed; border-top: 1px #ccc; border-bottom: 1px #ccc; border-left: 0px; border-right: 0px; box-sizing: border-box; cursor: row-resize; user-select: none"></div>';
const VERTICAL_RESIZER_HTML =
    '<div style="position: fixed; border-left: 1px #ccc; border-right: 1px #ccc; border-top: 0px; border-bottom: 0px; box-sizing: border-box; cursor: col-resize; user-select: none"></div>';

const enum ResizeState {
    None,
    Horizontal,
    Vertical,
}

/**
 * TableResize plugin, provides the ability to resize a table by drag-and-drop
 */
export default class TableResize implements EditorPlugin {
    private editor: Editor;
    // private onMouseOverDisposer: () => void;
    // private td: HTMLTableCellElement;
    // private pageX = -1;
    // private initialPageX: number;

    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private resizerContainer: HTMLDivElement;
    private currentTable: HTMLTableElement;
    private currentTd: HTMLTableCellElement;
    private horizontalResizer: HTMLDivElement;
    private verticalResizer: HTMLDivElement;
    private moveHandle: HTMLDivElement;

    private resizerStartPos: number = null;
    private resizingState: ResizeState = ResizeState.None;

    private currentInsertTd: HTMLTableCellElement;
    private insertingState: ResizeState = ResizeState.None;
    private inserter: HTMLDivElement;

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
    initialize(editor: Editor) {
        this.editor = editor;
        // this.onMouseOverDisposer = this.editor.addDomEventHandler('mouseover', this.onMouseOver);
        this.setupResizerContainer();

        this.onMouseMoveDisposer = this.editor.addDomEventHandler('mousemove', this.onMouseMove);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.destoryRectMap();
        this.removeResizerContainer();

        this.editor = null;
        // this.detachMouseEvents();
        // this.onMouseOverDisposer();
    }

    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.Input:
            case PluginEventType.ContentChanged:
            case PluginEventType.Scroll:
                this.destoryRectMap();
                break;
        }
    }

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
                    e.pageX >= rect.left - TABLE_MOVER_WIDTH &&
                    e.pageX <= rect.right &&
                    e.pageY >= rect.top - TABLE_MOVER_WIDTH &&
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
                        const td = tr.cells[Math.max(0, j)];
                        const tdRect = normalizeRect(td.getBoundingClientRect());

                        if (e.pageX <= tdRect.right && e.pageY < tdRect.bottom) {
                            if (i == 0 && e.pageY < tdRect.top) {
                                this.setCurrentTd(null);
                                this.setCurrentInsertTd(ResizeState.Vertical, td, map.rect);
                                break;
                            } else if (j == 0 && e.pageX < tdRect.left) {
                                this.setCurrentTd(null);
                                this.setCurrentInsertTd(ResizeState.Horizontal, td, map.rect);
                                break;
                            } else {
                                this.setCurrentTd(td, map.rect, tdRect.right, tdRect.bottom);
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
        const rect = normalizeRect(this.currentInsertTd.getBoundingClientRect());
        const inserter = fromHtml(
            this.insertingState == ResizeState.Horizontal
                ? HORIZONTAL_INSERTER_HTML
                : VERTICAL_INSERTER_HTML,
            this.editor.getDocument()
        )[0] as HTMLDivElement;

        if (this.insertingState == ResizeState.Horizontal) {
            inserter.style.left = `${rect.left -
                (INSERTER_SIDE_LENGTH + 2 * INSERTER_BORDER_SIZE)}px`;
            inserter.style.top = `${rect.bottom - 8}px`;
            (inserter.firstChild as HTMLElement).style.width = `${tableRect.right -
                tableRect.left}px`;
        } else {
            inserter.style.left = `${rect.right - 8}px`;
            inserter.style.top = `${rect.top -
                (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)}px`;
            (inserter.firstChild as HTMLElement).style.height = `${tableRect.bottom -
                tableRect.top}px`;
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
            this.setCurrentInsertTd(null);
            if (this.currentTable) {
                this.resizerContainer.removeChild(this.moveHandle);
            }
            this.currentTable = table;
            if (this.currentTable) {
                this.moveHandle = this.createMoveHandle(rect);
                this.resizerContainer.appendChild(this.moveHandle);
            }
        }
    }

    private setCurrentTd(td: null): void;
    private setCurrentTd(
        td: HTMLTableCellElement,
        tableRect: Rect,
        right: number,
        bottom: number
    ): void;
    private setCurrentTd(
        td: HTMLTableCellElement,
        tableRect?: Rect,
        right?: number,
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
                    right - CELL_RESIZER_WIDTH + 1,
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
            horizontal ? HORITONZAL_RESIZER_HTML : VERTICAL_RESIZER_HTML,
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

        // div.firstChild.addEventListener(
        //     'click',
        //     horizontal ? this.onInsertBelow : this.onInsertRight
        // );

        return div;
    }

    private startHorizontalResizeTable = (e: MouseEvent) => {
        this.resizingState = ResizeState.Horizontal;
        this.startResizeTable(e);
    };

    private startVerticalResizeTable = (e: MouseEvent) => {
        this.resizingState = ResizeState.Vertical;
        this.startResizeTable(e);
    };

    private startResizeTable(e: MouseEvent) {
        this.resizerStartPos = this.resizingState == ResizeState.Horizontal ? e.pageY : e.pageX;
        const doc = this.editor.getDocument();
        doc.addEventListener('mousemove', this.resizeTable, true);
        doc.addEventListener('mouseup', this.endResizeTable, true);

        const resizer =
            this.resizingState == ResizeState.Horizontal
                ? this.horizontalResizer
                : this.verticalResizer;
        resizer.style.borderStyle = 'solid';
    }

    private resizeTable = (e: MouseEvent) => {
        const rect = normalizeRect(this.currentTd.getBoundingClientRect());
        if (this.resizingState == ResizeState.Horizontal) {
            const delta = e.pageY - this.resizerStartPos;
            const newPos = rect.bottom + delta - CELL_RESIZER_WIDTH + 1;
            this.horizontalResizer.style.top = `${newPos}px`;
        } else {
            const delta = e.pageX - this.resizerStartPos;
            const newPos = rect.right + delta - CELL_RESIZER_WIDTH + 1;
            this.verticalResizer.style.left = `${newPos}px`;
        }
    };

    private endResizeTable = (e: MouseEvent) => {
        const doc = this.editor.getDocument();
        doc.removeEventListener('mousemove', this.resizeTable, true);
        doc.removeEventListener('mouseup', this.endResizeTable, true);

        const rect = normalizeRect(this.currentTd.getBoundingClientRect());
        const newPos =
            (this.resizingState == ResizeState.Horizontal
                ? rect.bottom + e.pageY
                : rect.right + e.pageX) - this.resizerStartPos;

        this.editor.addUndoSnapshot((start, end) => {
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
                vtable.table.style.width = '';
                vtable.table.width = '';
                vtable.forEachCellOfCurrentColumn(cell => {
                    if (cell.td) {
                        cell.td.style.width =
                            cell.td == this.currentTd ? `${newPos - rect.left}px` : null;
                    }
                });
            }
            vtable.writeBack();
            this.editor.select(start, end);
        }, ChangeSource.Format);

        this.setCurrentTd(null);
        this.resizingState = ResizeState.None;
    };

    private createMoveHandle(rect: Rect) {
        const div = fromHtml(MOVE_HANDLE_HTML, this.editor.getDocument())[0] as HTMLDivElement;
        div.style.left = `${rect.left - TABLE_MOVER_WIDTH}px`;
        div.style.top = `${rect.top - TABLE_MOVER_WIDTH}px`;
        return div;
    }

    private destoryRectMap() {
        this.setCurrentTable(null);
        this.tableRectMap = null;
    }

    private cacheRects() {
        this.destoryRectMap();
        this.tableRectMap = [];
        this.editor.queryElements('table', table => {
            const rect = normalizeRect(table.getBoundingClientRect());
            if (rect) {
                this.tableRectMap.push({
                    table,
                    rect,
                });
            }
        });
    }

    // private onInsertBelow = () => {
    //     if (this.currentTd) {
    //         this.editor.focus();
    //         this.editor.select(this.currentTd, PositionType.Begin);
    //         editTable(this.editor, TableOperation.InsertBelow);
    //     }
    // };

    // private onInsertRight = () => {
    //     if (this.currentTd) {
    //         this.editor.focus();
    //         this.editor.select(this.currentTd, PositionType.Begin);
    //         editTable(this.editor, TableOperation.InsertRight);
    //     }
    // };

    // /**
    //  * Handle events triggered from editor
    //  * @param event PluginEvent object
    //  */
    // onPluginEvent(event: PluginEvent) {
    //     if (
    //         this.td &&
    //         (event.eventType == PluginEventType.KeyDown ||
    //             event.eventType == PluginEventType.ContentChanged ||
    //             (event.eventType == PluginEventType.MouseDown && !this.clickIntoCurrentTd(event)))
    //     ) {
    //         this.td = null;
    //         this.calcAndShowHandle();
    //     }
    // }

    // private clickIntoCurrentTd(event: PluginMouseEvent) {
    //     let mouseEvent = event.rawEvent;
    //     let target = mouseEvent.target;
    //     return isNode(target) && contains(this.td, <Node>target, true /*treatSameNodeAsContain*/);
    // }

    // private onMouseOver = (e: MouseEvent) => {
    //     let node = <HTMLElement>(e.srcElement || e.target);
    //     if (
    //         this.pageX < 0 &&
    //         node &&
    //         (node.tagName == 'TD' || node.tagName == 'TH') &&
    //         node != this.td
    //     ) {
    //         this.td = <HTMLTableCellElement>node;
    //         this.calcAndShowHandle();
    //     }
    // };

    // private calcAndShowHandle() {
    //     if (this.td) {
    //         let tr = <HTMLTableRowElement>this.editor.getElementAtCursor('TR', this.td);
    //         let table = <HTMLTableElement>this.editor.getElementAtCursor('TABLE', tr);
    //         if (tr && table) {
    //             let [left, top] = this.getPosition(table);
    //             let handle = this.getResizeHandle();

    //             left +=
    //                 this.td.offsetLeft + (isRtl(table) ? 0 : this.td.offsetWidth - HANDLE_WIDTH);
    //             handle.style.display = '';
    //             handle.style.top = top + 'px';
    //             handle.style.height = table.offsetHeight + 'px';
    //             handle.style.left = left + 'px';
    //         }
    //     } else {
    //         this.getResizeHandle().style.display = 'none';
    //     }
    // }

    // private adjustHandle(pageX: number) {
    //     let handle = this.getResizeHandle();
    //     handle.style.left = handle.offsetLeft + pageX - this.pageX + 'px';
    //     this.pageX = pageX;
    // }

    // private getPosition(e: HTMLElement): [number, number] {
    //     let parent = <HTMLElement>e.offsetParent;
    //     let [left, top] = parent ? this.getPosition(parent) : [0, 0];
    //     return [left + e.offsetLeft - e.scrollLeft, top + e.offsetTop - e.scrollTop];
    // }

    // private getResizeHandle() {
    //     return this.editor.getCustomData(
    //         TABLE_RESIZE_HANDLE_KEY,
    //         () => {
    //             let document = this.editor.getDocument();
    //             let handle = fromHtml(CONTAINER_HTML, document)[0] as HTMLElement;
    //             this.editor.insertNode(handle, {
    //                 position: ContentPosition.Outside,
    //                 updateCursor: false,
    //                 replaceSelection: false,
    //                 insertOnNewLine: false,
    //             });
    //             handle.addEventListener('mousedown', this.onMouseDown);
    //             return handle;
    //         },
    //         handle => {
    //             handle.removeEventListener('mousedown', this.onMouseDown);
    //             handle.parentNode.removeChild(handle);
    //         }
    //     );
    // }

    // private cancelEvent(e: MouseEvent) {
    //     e.stopPropagation();
    //     e.preventDefault();
    // }

    // private onMouseDown = (e: MouseEvent) => {
    //     if (!this.editor || this.editor.isDisposed()) {
    //         return;
    //     }

    //     this.pageX = e.pageX;
    //     this.initialPageX = e.pageX;
    //     this.attachMouseEvents();

    //     let handle = this.getResizeHandle();
    //     handle.style.borderWidth = '0 1px';

    //     this.cancelEvent(e);
    // };

    // private onMouseMove = (e: MouseEvent) => {
    //     this.adjustHandle(e.pageX);
    //     this.cancelEvent(e);
    // };

    // private onMouseUp = (e: MouseEvent) => {
    //     this.detachMouseEvents();

    //     let handle = this.getResizeHandle();
    //     handle.style.borderWidth = '0';

    //     let table = this.editor.getElementAtCursor('TABLE', this.td) as HTMLTableElement;
    //     let cellPadding = parseInt(table.cellPadding);
    //     cellPadding = isNaN(cellPadding) ? 0 : cellPadding;

    //     if (e.pageX != this.initialPageX) {
    //         let newWidth =
    //             this.td.clientWidth -
    //             cellPadding * 2 +
    //             (e.pageX - this.initialPageX) * (isRtl(table) ? -1 : 1);
    //         this.editor.addUndoSnapshot((start, end) => {
    //             this.setTableColumnWidth(newWidth + 'px');
    //             this.editor.select(start, end);
    //         }, ChangeSource.Format);
    //     }

    //     this.pageX = -1;
    //     this.calcAndShowHandle();
    //     this.editor.focus();
    //     this.cancelEvent(e);
    // };

    // private attachMouseEvents() {
    //     if (this.editor && !this.editor.isDisposed()) {
    //         let document = this.editor.getDocument();
    //         document.addEventListener('mousemove', this.onMouseMove, true);
    //         document.addEventListener('mouseup', this.onMouseUp, true);
    //     }
    // }

    // private detachMouseEvents() {
    //     if (this.editor && !this.editor.isDisposed()) {
    //         let document = this.editor.getDocument();
    //         document.removeEventListener('mousemove', this.onMouseMove, true);
    //         document.removeEventListener('mouseup', this.onMouseUp, true);
    //     }
    // }

    // private setTableColumnWidth(width: string) {
    //     let vtable = new VTable(this.td);
    //     vtable.table.style.width = '';
    //     vtable.table.width = '';
    //     vtable.forEachCellOfCurrentColumn(cell => {
    //         if (cell.td) {
    //             cell.td.style.width = cell.td == this.td ? width : '';
    //         }
    //     });
    //     vtable.writeBack();
    //     return this.editor.contains(this.td) ? this.td : vtable.getCurrentTd();
    // }
}
