import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { fromHtml, normalizeRect, VTable } from 'roosterjs-editor-dom';
import {
    PluginEvent,
    PluginEventType,
    Rect,
    ChangeSource,
    TableOperation,
    ContentPosition,
} from 'roosterjs-editor-types';

const INSERTER_COLOR = '#4A4A4A';
const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;

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
    private editor: Editor;
    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private resizerContainer: HTMLDivElement;
    private currentTable: HTMLTableElement;
    private currentTd: HTMLTableCellElement;
    private horizontalResizer: HTMLDivElement;
    private verticalResizer: HTMLDivElement;
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
                    e.pageX >= rect.left - INSERTER_SIDE_LENGTH &&
                    e.pageX <= rect.right &&
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
        const editorBackgroundColor = this.editor.getDefaultFormat().backgroundColor;
        const inserterBackgroundColor = editorBackgroundColor || 'white';
        const HORIZONTAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${INSERTER_COLOR}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${INSERTER_COLOR}; border-radius: 50%; background-color: ${inserterBackgroundColor}"><div style="position: absolute; left: 12px; top: 5px; height: 3px; border-top: 1px solid ${INSERTER_COLOR}; border-bottom: 1px solid ${INSERTER_COLOR}; border-right: 1px solid ${INSERTER_COLOR}; border-left: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor};"></div>+</div>`;
        const VERTICAL_INSERTER_HTML = `<div style="position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: ${INSERTER_COLOR}; line-height: 10px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${INSERTER_COLOR}; border-radius: 50%; background-color: ${inserterBackgroundColor}"><div style="position: absolute; left: 5px; top: 12px; width: 3px; border-left: 1px solid ${INSERTER_COLOR}; border-right: 1px solid ${INSERTER_COLOR}; border-bottom: 1px solid ${INSERTER_COLOR}; border-top: 0px; box-sizing: border-box; background-color: ${inserterBackgroundColor};"></div>+</div>`;

        const inserter = fromHtml(
            this.insertingState == ResizeState.Horizontal
                ? HORIZONTAL_INSERTER_HTML
                : VERTICAL_INSERTER_HTML,
            this.editor.getDocument()
        )[0] as HTMLDivElement;

        if (this.insertingState == ResizeState.Horizontal) {
            inserter.style.left = `${rect.left -
                (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)}px`;
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
            this.currentTable = table;
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

    private resizeTable = (e: MouseEvent) => {
        if (this.currentTd) {
            const rect = normalizeRect(this.currentTd.getBoundingClientRect());
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
        }
    };

    private endResizeTable = (e: MouseEvent) => {
        const doc = this.editor.getDocument();
        doc.removeEventListener('mousemove', this.frameAnimateResizeTable, true);
        doc.removeEventListener('mouseup', this.endResizeTable, true);

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
            const rect = normalizeRect(table.getBoundingClientRect());
            if (rect) {
                this.tableRectMap.push({
                    table,
                    rect,
                });
            }
        });
    }
}
