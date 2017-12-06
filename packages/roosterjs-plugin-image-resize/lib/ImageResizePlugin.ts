import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, PluginDomEvent, ExtractContentEvent, ContentChangedEvent } from 'roosterjs-editor-types';
import { contains, getTagOfNode } from 'roosterjs-editor-dom';
import { execFormatWithUndo } from 'roosterjs-editor-api';

const BEGIN_TAG = 'RoosterJsImageResizingBegin';
const END_TAG = 'RoosterJsImageResizingEnd';
const EXTRACT_HTML_REGEX = new RegExp(`<!--${BEGIN_TAG}-->[\\s\\S]*(<img\\s[^>]+>)[\\s\\S]*<!--${END_TAG}-->`, 'gim');
const DELETE_KEYCODE = 46;
const BACKSPACE_KEYCODE = 8;
const SHIFT_KEYCODE = 16;

export default class ImageResizePlugin implements EditorPlugin {
    private editor: Editor;
    private px: number;
    private py: number;
    private ratio: number;
    private resizeDiv: HTMLElement;
    private startComment: Node;
    private endComment: Node;
    private resizingHandle: HTMLElement;

    constructor(
        private minWidth: number = 10,
        private minHeight: number = 10,
        private selectionBorderColor: string = 'red',
        private forcePreserveRatio: boolean = false
    ) {}

    initialize(editor: Editor) {
        this.editor = editor;
        this.editor.getDocument().execCommand('enableObjectResizing', false, false);
    }

    dispose() {
        if (this.resizeDiv) {
            this.unselect();
        }
        this.editor = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.MouseUp) {
            let event = (<PluginDomEvent>e).rawEvent;
            let target = <HTMLElement>(event.srcElement || event.target);
            if (getTagOfNode(target) == 'IMG') {
                event.stopPropagation();
                let currentImg = this.getSelectedImage();
                if (currentImg && currentImg != target) {
                    this.unselect();
                }

                if (!this.resizeDiv) {
                    this.resizeDiv = this.createResizeDiv(target);
                    let range = document.createRange();
                    range.setEndAfter(this.resizeDiv);
                    range.collapse(false /*toStart*/);
                    this.editor.updateSelection(range);
                }
            } else if (this.resizeDiv && !contains(this.resizeDiv, target)) {
                this.unselect();
            }
        } else if (e.eventType == PluginEventType.KeyDown && this.resizeDiv) {
            let event = <KeyboardEvent>(<PluginDomEvent>e).rawEvent;
            if (event.which == DELETE_KEYCODE || event.which == BACKSPACE_KEYCODE) {
                execFormatWithUndo(this.editor, () => {
                    this.removeResizeDiv();
                });
                event.preventDefault();
            } else if (event.which != SHIFT_KEYCODE) {
                this.unselect();
            }
        } else if (e.eventType == PluginEventType.ExtractContent) {
            let event = <ExtractContentEvent>e;
            event.content = this.extractHtml(event.content);
        }
    }

    private getSelectedImage(): HTMLElement {
        return this.resizeDiv ? <HTMLElement>this.resizeDiv.getElementsByTagName('IMG')[0] : null;
    }

    private unselect() {
        let img = this.getSelectedImage();
        let parent = this.resizeDiv.parentNode;
        if (parent) {
            if (img) {
                parent.insertBefore(img, this.resizeDiv);
            }
            this.removeResizeDiv();
        }
    }

    private createResizeDiv(target: HTMLElement) {
        let document = this.editor.getDocument();
        let resizeDiv = document.createElement('DIV');
        let parent = target.parentNode;
        parent.insertBefore(resizeDiv, target);
        parent.insertBefore(this.startComment = document.createComment(BEGIN_TAG), resizeDiv);
        parent.insertBefore(this.endComment = document.createComment(END_TAG), resizeDiv.nextSibling);

        resizeDiv.style.position = 'relative';
        resizeDiv.style.display = 'inline-block';
        resizeDiv.style.width = target.clientWidth + 'px';
        resizeDiv.style.height = target.clientHeight + 'px';
        resizeDiv.contentEditable = 'false';
        resizeDiv.appendChild(target);
        ['nw', 'ne', 'sw', 'se'].forEach(pos => {
            let div = document.createElement('DIV');
            resizeDiv.appendChild(div);
            div.style.position = 'absolute';
            div.style.width = '7px';
            div.style.height = '7px';
            div.style.backgroundColor = this.selectionBorderColor;
            div.style.cursor = pos + '-resize';
            if (pos.substr(0, 1) == 'n') {
                div.style.top = '-3px';
            } else {
                div.style.bottom = '-3px';
            }
            if (pos.substr(1, 1) == 'w') {
                div.style.left = '-3px';
            } else {
                div.style.right = '-3px';
            }
            div.addEventListener('mousedown', this.startResize);
        });
        let div = document.createElement('DIV');
        resizeDiv.appendChild(div);
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.right = '0';
        div.style.bottom = '0';
        div.style.border = 'solid 1px ' + this.selectionBorderColor;
        return resizeDiv;
    }

    private startResize = (e: MouseEvent) => {
        let img = this.getSelectedImage();
        if (this.editor && img) {
            this.editor.addUndoSnapshot();

            let document = this.editor.getDocument();
            document.addEventListener('mousemove', this.resizing, true /*useCapture*/);
            document.addEventListener('mouseup', this.finishResize, true /*useCapture*/);
            this.px = e.pageX;
            this.py = e.pageY;
            this.resizingHandle = <HTMLElement>(e.srcElement || e.target);
            if (img) {
                this.ratio = (img.clientWidth > 0 && img.clientHeight > 0) ? img.clientWidth * 1.0 / img.clientHeight : 0;
            }

            this.resizeDiv.style.width = this.resizeDiv.clientWidth + 'px';
            this.resizeDiv.style.height = this.resizeDiv.clientHeight + 'px';
        }

        e.preventDefault();
    }

    private resizing = (e: MouseEvent) => {
        let img = this.getSelectedImage();
        if (this.editor && img && this.resizingHandle) {
            let widthChange: number;
            let heightChange: number;
            let cursor = this.resizingHandle.style.cursor;
            switch (cursor) {
                case 'nw-resize':
                    widthChange = this.px - e.pageX;
                    heightChange = this.py - e.pageY;
                    break;
                case 'ne-resize':
                    widthChange = e.pageX - this.px;
                    heightChange = this.py - e.pageY;
                    break;
                case 'sw-resize':
                    widthChange = this.px - e.pageX;
                    heightChange = e.pageY - this.py;
                    break;
                case 'se-resize':
                    widthChange = e.pageX - this.px;
                    heightChange = e.pageY - this.py;
                    break;
            }

            let newWidth = Math.max(this.resizeDiv.clientWidth + widthChange, this.minWidth);
            let newHeight = Math.max(this.resizeDiv.clientHeight + heightChange, this.minHeight);
            this.resizeDiv.style.width = newWidth + 'px';
            this.resizeDiv.style.height = newHeight + 'px';

            if (this.ratio > 0 && (this.forcePreserveRatio || e.shiftKey)) {
                if (newWidth > newHeight * this.ratio) {
                    newWidth = newHeight * this.ratio;
                } else {
                    newHeight = newWidth / this.ratio;
                }
            }
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            this.px = e.pageX;
            this.py = e.pageY;
        }
        e.preventDefault();
    }

    private finishResize = (e: MouseEvent) => {
        var img = this.getSelectedImage();
        if (this.editor && img) {
            let document = this.editor.getDocument();
            document.removeEventListener('mousemove', this.resizing, true /*useCapture*/);
            document.removeEventListener('mouseup', this.finishResize, true /*useCapture*/);
            img.style.width = img.clientWidth + 'px';
            img.style.height = img.clientHeight + 'px';
            this.resizeDiv.style.width = '';
            this.resizeDiv.style.height = '';
        }
        this.resizingHandle = null;
        this.editor.addUndoSnapshot();
        this.triggerContentChangedEvent();
        e.preventDefault();
    }

    private removeResizeDiv() {
        let parent = this.resizeDiv.parentNode;
        if (this.startComment) {
            parent.removeChild(this.startComment);
        }
        if (this.endComment) {
            parent.removeChild(this.endComment);
        }
        parent.removeChild(this.resizeDiv);
        this.resizeDiv = this.startComment = this.endComment = null;
    }

    private extractHtml(html: string): string {
        return html.replace(EXTRACT_HTML_REGEX, '$1');
    }

    private triggerContentChangedEvent() {
        let eventToTrigger: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'ImageResize',
        };
        this.editor.triggerEvent(eventToTrigger);
    }
}
