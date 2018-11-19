import { contains, fromHtml, getComputedStyle, VTable } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ContentPosition,
    PluginEvent,
    PluginEventType,
    PluginMouseEvent,
    ChangeSource,
} from 'roosterjs-editor-types';

const TABLE_RESIZE_HANDLE_KEY = 'TABLE_RESIZE_HANDLE';
const HANDLE_WIDTH = 6;
const CONTAINER_HTML = `<div style="position: fixed; cursor: col-resize; width: ${HANDLE_WIDTH}px; border: solid 0 #C6C6C6;"></div>`;

export default class TableResize implements EditorPlugin {
    private editor: Editor;
    private onMouseOverDisposer: () => void;
    private td: HTMLTableCellElement;
    private pageX = -1;
    private initialPageX: number;
    public name: 'TableResize';

    constructor(isRtl?: boolean) {}

    initialize(editor: Editor) {
        this.editor = editor;
        this.onMouseOverDisposer = this.editor.addDomEventHandler('mouseover', this.onMouseOver);
    }

    dispose() {
        this.detachMouseEvents();
        this.editor = null;
        this.onMouseOverDisposer();
    }

    onPluginEvent(event: PluginEvent) {
        if (
            this.td &&
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.ContentChanged ||
                (event.eventType == PluginEventType.MouseDown && !this.clickIntoCurrentTd(event)))
        ) {
            this.td = null;
            this.calcAndShowHandle();
        }
    }

    private clickIntoCurrentTd(event: PluginMouseEvent) {
        let mouseEvent = event.rawEvent;
        let target = mouseEvent.target;
        return (
            target instanceof Node &&
            contains(this.td, <Node>target, true /*treatSameNodeAsContain*/)
        );
    }

    private onMouseOver = (e: MouseEvent) => {
        let node = <HTMLElement>(e.srcElement || e.target);
        if (
            this.pageX < 0 &&
            node &&
            (node.tagName == 'TD' || node.tagName == 'TH') &&
            node != this.td
        ) {
            this.td = <HTMLTableCellElement>node;
            this.calcAndShowHandle();
        }
    };

    private calcAndShowHandle() {
        if (this.td) {
            let tr = <HTMLTableRowElement>this.editor.getElementAtCursor('TR', this.td);
            let table = <HTMLTableElement>this.editor.getElementAtCursor('TABLE', tr);
            if (tr && table) {
                let [left, top] = this.getPosition(table);
                let handle = this.getResizeHandle();

                left +=
                    this.td.offsetLeft +
                    (this.isRtl(table) ? 0 : this.td.offsetWidth - HANDLE_WIDTH);
                handle.style.display = '';
                handle.style.top = top + 'px';
                handle.style.height = table.offsetHeight + 'px';
                handle.style.left = left + 'px';
            }
        } else {
            this.getResizeHandle().style.display = 'none';
        }
    }

    private adjustHandle(pageX: number) {
        let handle = this.getResizeHandle();
        handle.style.left = handle.offsetLeft + pageX - this.pageX + 'px';
        this.pageX = pageX;
    }

    private getPosition(e: HTMLElement): [number, number] {
        let parent = <HTMLElement>e.offsetParent;
        let [left, top] = parent ? this.getPosition(parent) : [0, 0];
        return [left + e.offsetLeft - e.scrollLeft, top + e.offsetTop - e.scrollTop];
    }

    private getResizeHandle() {
        return this.editor.getCustomData(
            TABLE_RESIZE_HANDLE_KEY,
            () => {
                let document = this.editor.getDocument();
                let handle = fromHtml(CONTAINER_HTML, document)[0] as HTMLElement;
                this.editor.insertNode(handle, {
                    position: ContentPosition.Outside,
                    updateCursor: false,
                    replaceSelection: false,
                    insertOnNewLine: false,
                });
                handle.addEventListener('mousedown', this.onMouseDown);
                return handle;
            },
            handle => {
                handle.removeEventListener('mousedown', this.onMouseDown);
                handle.parentNode.removeChild(handle);
            }
        );
    }

    private cancelEvent(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    }

    private onMouseDown = (e: MouseEvent) => {
        if (!this.editor || this.editor.isDisposed()) {
            return;
        }

        this.pageX = e.pageX;
        this.initialPageX = e.pageX;
        this.attachMouseEvents();

        let handle = this.getResizeHandle();
        handle.style.borderWidth = '0 1px';

        this.cancelEvent(e);
    };

    private onMouseMove = (e: MouseEvent) => {
        this.adjustHandle(e.pageX);
        this.cancelEvent(e);
    };

    private onMouseUp = (e: MouseEvent) => {
        this.detachMouseEvents();

        let handle = this.getResizeHandle();
        handle.style.borderWidth = '0';

        let table = this.editor.getElementAtCursor('TABLE', this.td) as HTMLTableElement;
        let cellPadding = parseInt(table.cellPadding);
        cellPadding = isNaN(cellPadding) ? 0 : cellPadding;

        if (e.pageX != this.initialPageX) {
            let newWidth =
                this.td.clientWidth -
                cellPadding * 2 +
                (e.pageX - this.initialPageX) * (this.isRtl(table) ? -1 : 1);
            this.editor.addUndoSnapshot((start, end) => {
                this.setTableColumnWidth(newWidth + 'px');
                this.editor.select(start, end);
            }, ChangeSource.Format);
        }

        this.pageX = -1;
        this.calcAndShowHandle();
        this.editor.focus();
        this.cancelEvent(e);
    };

    private attachMouseEvents() {
        if (this.editor && !this.editor.isDisposed()) {
            let document = this.editor.getDocument();
            document.addEventListener('mousemove', this.onMouseMove, true);
            document.addEventListener('mouseup', this.onMouseUp, true);
        }
    }

    private detachMouseEvents() {
        if (this.editor && !this.editor.isDisposed()) {
            let document = this.editor.getDocument();
            document.removeEventListener('mousemove', this.onMouseMove, true);
            document.removeEventListener('mouseup', this.onMouseUp, true);
        }
    }

    private setTableColumnWidth(width: string) {
        let vtable = new VTable(this.td);
        vtable.table.style.width = '';
        vtable.table.width = '';
        vtable.forEachCellOfCurrentColumn(cell => {
            if (cell.td) {
                cell.td.style.width = cell.td == this.td ? width : '';
            }
        });
        vtable.writeBack();
        return this.editor.contains(this.td) ? this.td : vtable.getCurrentTd();
    }

    private isRtl(element: HTMLElement) {
        return getComputedStyle(element, 'direction') == 'rtl';
    }
}
