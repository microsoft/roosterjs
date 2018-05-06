import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, PluginDomEvent } from 'roosterjs-editor-types';
import { VTable, getNodeAtCursor } from 'roosterjs-editor-api';
import { contains, fromHtml, getComputedStyles } from 'roosterjs-editor-dom';

const TABLE_RESIZE_HANDLE_KEY = 'TABLE_RESIZE_HANDLE';
const HANDLE_WIDTH = 6;
const CONTAINER_HTML = `<div style="position: absolute; cursor: col-resize; width: ${HANDLE_WIDTH}px; border: solid 0 #C6C6C6;"></div>`;

/**
 * A plugin to support the functionality of resizing a table inside editor.
 */
export default class TableResize implements EditorPlugin {
    private editor: Editor;
    private onMouseOverDisposer: () => void;
    private td: HTMLTableCellElement;
    private pageX = -1;
    private initialPageX: number;

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: Editor) {
        this.editor = editor;
        this.onMouseOverDisposer = this.editor.addDomEventHandler('mouseover', this.onMouseOver);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.onMouseOverDisposer();
    }

    /**
     * Handle plugin events
     * @param event The event object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            this.td &&
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.ContentChanged ||
                (event.eventType == PluginEventType.MouseDown &&
                    !this.clickIntoCurrentTd(<PluginDomEvent>event)))
        ) {
            this.td = null;
            this.calcAndShowHandle();
        }
    }

    private clickIntoCurrentTd(event: PluginDomEvent) {
        let mouseEvent = <MouseEvent>event.rawEvent;
        let target = mouseEvent.target;
        return target instanceof Node && (this.td == target || contains(this.td, <Node>target));
    }

    private onMouseOver = (e: MouseEvent) => {
        let node = <HTMLElement>(e.srcElement || e.target);
        if (this.pageX < 0 && node && ['TD', 'TH'].indexOf(node.tagName) >= 0 && node != this.td) {
            this.td = <HTMLTableCellElement>node;
            this.calcAndShowHandle();
        }
    };

    private calcAndShowHandle() {
        if (this.td) {
            let tr = <HTMLTableRowElement>getNodeAtCursor(this.editor, 'TR', this.td);
            let table = <HTMLTableElement>getNodeAtCursor(this.editor, 'TABLE', tr);
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
                document.body.appendChild(handle);
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
        this.pageX = e.pageX;
        this.initialPageX = e.pageX;
        let document = this.editor.getDocument();

        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mouseup', this.onMouseUp, true);

        let handle = this.getResizeHandle();
        handle.style.borderWidth = '0 1px';

        this.cancelEvent(e);
    };

    private onMouseMove = (e: MouseEvent) => {
        this.adjustHandle(e.pageX);
        this.cancelEvent(e);
    };

    private onMouseUp = (e: MouseEvent) => {
        let document = this.editor.getDocument();
        document.removeEventListener('mousemove', this.onMouseMove, true);
        document.removeEventListener('mouseup', this.onMouseUp, true);

        let handle = this.getResizeHandle();
        handle.style.borderWidth = '0';

        let table = getNodeAtCursor(this.editor, 'TABLE', this.td) as HTMLTableElement;
        let cellPadding = parseInt(table.cellPadding);
        cellPadding = isNaN(cellPadding) ? 0 : cellPadding;

        if (e.pageX != this.initialPageX) {
            let newWidth =
                this.td.clientWidth -
                cellPadding * 2 +
                (e.pageX - this.initialPageX) * (this.isRtl(table) ? -1 : 1);
            this.editor.formatWithUndo(
                () => this.setTableColumnWidth(newWidth + 'px'),
                true /*preserveSelection*/
            );
        }

        this.pageX = -1;
        this.calcAndShowHandle();
        this.editor.focus();
        this.cancelEvent(e);
    };

    private setTableColumnWidth(width: string) {
        let vtable = new VTable(this.td);
        vtable.table.style.width = '';
        vtable.forEachCellOfCurrentColumn(cell => {
            if (cell.td) {
                cell.td.style.width = cell.td == this.td ? width : '';
            }
        });
        vtable.writeBack();
        return this.editor.contains(this.td) ? this.td : vtable.getCurrentTd();
    }

    private isRtl(element: HTMLElement) {
        return getComputedStyles(element, 'direction')[0] == 'rtl';
    }
}
