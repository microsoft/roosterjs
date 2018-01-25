import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ChangeSource,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginDomEvent,
    ExtractContentEvent,
} from 'roosterjs-editor-types';
import { contains, getTagOfNode } from 'roosterjs-editor-dom';
import { execFormatWithUndo } from 'roosterjs-editor-api';

const BEGIN_TAG = 'RoosterJsImageResizingBegin';
const END_TAG = 'RoosterJsImageResizingEnd';
const EXTRACT_HTML_REGEX = new RegExp(
    `<!--${BEGIN_TAG}-->[\\s\\S]*(<img\\s[^>]+>)[\\s\\S]*<!--${END_TAG}-->`,
    'gim'
);
const DELETE_KEYCODE = 46;
const BACKSPACE_KEYCODE = 8;
const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

export default class ImageResizePlugin implements EditorPlugin {
    private editor: Editor;
    private startPageX: number;
    private startPageY: number;
    private startWidth: number;
    private startHeight: number;
    private resizeDiv: HTMLElement;
    private direction: string;

    /**
     * Create a new instance of ImageResizePlugin
     * @param minWidth Minimum width of image when resize in pixel, default value is 10
     * @param minHeight Minimum height of image when resize in pixel, default value is 10
     * @param selectionBorderColor Color of resize border and handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when resize, default value is false
     */
    constructor(
        private minWidth: number = 10,
        private minHeight: number = 10,
        private selectionBorderColor: string = '#DB626C',
        private forcePreserveRatio: boolean = false
    ) {}

    initialize(editor: Editor) {
        this.editor = editor;
        this.editor.getDocument().execCommand('enableObjectResizing', false, false);
    }

    dispose() {
        if (this.resizeDiv) {
            this.unselect(false /*selectImageAfterUnSelect*/);
        }
        this.editor = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.MouseDown) {
            let event = (<PluginDomEvent>e).rawEvent;
            let target = <HTMLElement>(event.srcElement || event.target);
            if (getTagOfNode(target) == 'IMG') {
                target.contentEditable = 'false';
                let currentImg = this.getSelectedImage();
                if (currentImg && currentImg != target) {
                    this.unselect(false /*selectImageAfterUnSelect*/);
                }

                if (!this.resizeDiv) {
                    this.select(target);
                }
            } else if (this.resizeDiv && !contains(this.resizeDiv, target)) {
                this.unselect(false /*selectImageAfterUnSelect*/);
            }
        } else if (e.eventType == PluginEventType.KeyDown && this.resizeDiv) {
            let event = <KeyboardEvent>(<PluginDomEvent>e).rawEvent;
            if (event.which == DELETE_KEYCODE || event.which == BACKSPACE_KEYCODE) {
                execFormatWithUndo(this.editor, () => {
                    this.removeResizeDiv();
                });
                event.preventDefault();
            } else if (
                event.which != SHIFT_KEYCODE &&
                event.which != CTRL_KEYCODE &&
                event.which != ALT_KEYCODE
            ) {
                this.unselect(true /*selectImageAfterUnSelect*/);
            }
        } else if (e.eventType == PluginEventType.ExtractContent) {
            let event = <ExtractContentEvent>e;
            event.content = this.extractHtml(event.content);
        }
    }

    private select(target: HTMLElement) {
        this.resizeDiv = this.createResizeDiv(target);
        target.contentEditable = 'false';
        let range = document.createRange();
        range.setEndAfter(this.resizeDiv);
        range.collapse(false /*toStart*/);
        this.editor.updateSelection(range);
    }

    private unselect(selectImageAfterUnSelect: boolean) {
        let img = this.getSelectedImage();
        let parent = this.resizeDiv.parentNode;
        if (parent) {
            if (img) {
                img.removeAttribute('contentEditable');
                let referenceNode =
                    this.resizeDiv.previousSibling &&
                    this.resizeDiv.previousSibling.nodeType == NodeType.Comment
                        ? this.resizeDiv.previousSibling
                        : this.resizeDiv;
                parent.insertBefore(img, referenceNode);

                if (selectImageAfterUnSelect) {
                    let range = this.editor.getDocument().createRange();
                    range.selectNode(img);
                    this.editor.updateSelection(range);
                }
            }
            this.removeResizeDiv();
        }
    }

    private startResize = (e: MouseEvent) => {
        let img = this.getSelectedImage();
        if (this.editor && img) {
            this.startPageX = e.pageX;
            this.startPageY = e.pageY;
            this.startWidth = img.clientWidth;
            this.startHeight = img.clientHeight;
            this.editor.addUndoSnapshot();

            let document = this.editor.getDocument();
            document.addEventListener('mousemove', this.doResize, true /*useCapture*/);
            document.addEventListener('mouseup', this.finishResize, true /*useCapture*/);
            this.direction = (<HTMLElement>(e.srcElement || e.target)).style.cursor;
        }

        e.preventDefault();
    };

    private doResize = (e: MouseEvent) => {
        let img = this.getSelectedImage();
        if (this.editor && img) {
            let widthChange = e.pageX - this.startPageX;
            let heightChange = e.pageY - this.startPageY;
            let newWidth = Math.max(
                this.startWidth + (this.isWest(this.direction) ? -widthChange : widthChange),
                this.minWidth
            );
            let newHeight = Math.max(
                this.startHeight + (this.isNorth(this.direction) ? -heightChange : heightChange),
                this.minHeight
            );

            if (this.forcePreserveRatio || e.shiftKey) {
                let ratio =
                    this.startWidth > 0 && this.startHeight > 0
                        ? this.startWidth * 1.0 / this.startHeight
                        : 0;
                if (ratio > 0) {
                    if (newWidth < newHeight * ratio) {
                        newWidth = newHeight * ratio;
                    } else {
                        newHeight = newWidth / ratio;
                    }
                }
            }

            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
        }
        e.preventDefault();
    };

    private finishResize = (e: MouseEvent) => {
        var img = this.getSelectedImage() as HTMLImageElement;
        if (this.editor && img) {
            let document = this.editor.getDocument();
            document.removeEventListener('mousemove', this.doResize, true /*useCapture*/);
            document.removeEventListener('mouseup', this.finishResize, true /*useCapture*/);
            let width = img.clientWidth;
            let height = img.clientHeight;
            img.style.width = width + 'px';
            img.style.height = height + 'px';
            img.width = width;
            img.height = height;
            this.resizeDiv.style.width = '';
            this.resizeDiv.style.height = '';
        }
        this.direction = null;
        this.editor.addUndoSnapshot();
        this.editor.triggerContentChangedEvent(ChangeSource.ImageResize);
        e.preventDefault();
    };

    private createResizeDiv(target: HTMLElement) {
        let document = this.editor.getDocument();
        let resizeDiv = document.createElement('DIV');
        let parent = target.parentNode;
        parent.insertBefore(resizeDiv, target);
        parent.insertBefore(document.createComment(BEGIN_TAG), resizeDiv);
        parent.insertBefore(document.createComment(END_TAG), resizeDiv.nextSibling);

        resizeDiv.style.position = 'relative';
        resizeDiv.style.display = 'inline-table';
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
            if (this.isNorth(pos)) {
                div.style.top = '-3px';
            } else {
                div.style.bottom = '-3px';
            }
            if (this.isWest(pos)) {
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

    private removeResizeDiv() {
        if (this.resizeDiv) {
            let parent = this.resizeDiv.parentNode;
            [this.resizeDiv.previousSibling, this.resizeDiv.nextSibling].forEach(comment => {
                if (comment && comment.nodeType == NodeType.Comment) {
                    parent.removeChild(comment);
                }
            });
            parent.removeChild(this.resizeDiv);
            this.resizeDiv = null;
        }
    }

    private extractHtml(html: string): string {
        return html.replace(EXTRACT_HTML_REGEX, '$1');
    }

    private getSelectedImage(): HTMLElement {
        return this.resizeDiv ? <HTMLElement>this.resizeDiv.getElementsByTagName('IMG')[0] : null;
    }

    private isNorth(direction: string): boolean {
        return direction && direction.substr(0, 1) == 'n';
    }

    private isWest(direction: string): boolean {
        return direction && direction.substr(1, 1) == 'w';
    }
}
