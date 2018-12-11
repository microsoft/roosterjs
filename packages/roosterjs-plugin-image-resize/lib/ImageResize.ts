import { contains, getTagOfNode } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ContentChangedEvent,
    ChangeSource,
    NodeType,
    PluginEvent,
    PluginEventType,
    ExtractContentEvent,
    PositionType,
} from 'roosterjs-editor-types';

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

export default class ImageResize implements EditorPlugin {
    private editor: Editor;
    private startPageX: number;
    private startPageY: number;
    private startWidth: number;
    private startHeight: number;
    private resizeDiv: HTMLElement;
    private direction: string;
    private disposers: (() => void)[];
    public name: 'ImageResize';

    /**
     * Create a new instance of ImageResize
     * @param minWidth Minimum width of image when resize in pixel, default value is 10
     * @param minHeight Minimum height of image when resize in pixel, default value is 10
     * @param selectionBorderColor Color of resize border and handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when resize, default value is false
     * @param resizableImageSelector Selector for picking which image is resizable (e.g. for all images not placeholders), note
     * that the tag must be IMG regardless what the selector is
     */
    constructor(
        private minWidth: number = 10,
        private minHeight: number = 10,
        private selectionBorderColor: string = '#DB626C',
        private forcePreserveRatio: boolean = false,
        private resizableImageSelector: string = 'img'
    ) {}

    initialize(editor: Editor) {
        this.editor = editor;
        this.disposers = [
            editor.addDomEventHandler('dragstart', this.onDragStart),
            editor.addDomEventHandler('blur', this.onBlur),
        ];
    }

    dispose() {
        if (this.resizeDiv) {
            this.hideResizeHandle();
        }
        this.disposers.forEach(disposer => disposer());
        this.disposers = null;
        this.editor = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.MouseDown) {
            const event = e.rawEvent;
            const target = <HTMLElement>(event.srcElement || event.target);

            if (getTagOfNode(target) == 'IMG') {
                const parent = target.parentNode as HTMLElement;
                const elements = parent
                    ? ([].slice.call(
                          parent.querySelectorAll(this.resizableImageSelector)
                      ) as HTMLElement[])
                    : [];
                if (elements.indexOf(target) < 0) {
                    return;
                }

                target.contentEditable = 'false';
                const currentImg = this.getSelectedImage();
                if (currentImg && currentImg != target) {
                    this.hideResizeHandle();
                }

                if (!this.resizeDiv) {
                    this.showResizeHandle(<HTMLImageElement>target);
                }
            } else if (this.resizeDiv && !contains(this.resizeDiv, target)) {
                this.hideResizeHandle();
            }
        } else if (e.eventType == PluginEventType.KeyDown && this.resizeDiv) {
            const event = e.rawEvent;
            if (event.which == DELETE_KEYCODE || event.which == BACKSPACE_KEYCODE) {
                this.editor.addUndoSnapshot(() => {
                    this.removeResizeDiv(this.resizeDiv);
                });
                this.resizeDiv = null;
                event.preventDefault();
                this.resizeDiv = null;
            } else if (
                event.which != SHIFT_KEYCODE &&
                event.which != CTRL_KEYCODE &&
                event.which != ALT_KEYCODE
            ) {
                this.hideResizeHandle();
            }
        } else if (
            e.eventType == PluginEventType.ContentChanged &&
            (<ContentChangedEvent>e).source != ChangeSource.ImageResize
        ) {
            this.editor.queryElements('img', this.removeResizeDivIfAny);
            this.resizeDiv = null;
        } else if (e.eventType == PluginEventType.ExtractContent) {
            const event = <ExtractContentEvent>e;
            event.content = this.extractHtml(event.content);
        }
    }

    /**
     * Select a given IMG element, show the resize handle
     * @param img The IMG element to select
     */
    showResizeHandle(img: HTMLImageElement) {
        this.resizeDiv = this.createResizeDiv(img);
        img.contentEditable = 'false';
        this.editor.select(this.resizeDiv, PositionType.After);
    }

    /**
     * Hide resize handle of current selected image
     * @param selectImageAfterUnSelect Optional, when set to true, select the image element after hide the resize handle
     */
    hideResizeHandle(selectImageAfterUnSelect?: boolean) {
        let img = this.getSelectedImage();
        let parent = this.resizeDiv && this.resizeDiv.parentNode;
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
                    this.editor.select(img);
                } else {
                    this.editor.select(img, PositionType.After);
                }
            }
            this.removeResizeDiv(this.resizeDiv);
            this.resizeDiv = null;
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

        this.stopEvent(e);
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
                        ? (this.startWidth * 1.0) / this.startHeight
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
        this.stopEvent(e);
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
        this.stopEvent(e);
    };

    private createResizeDiv(target: HTMLElement) {
        let document = this.editor.getDocument();
        let resizeDiv = document.createElement('DIV');
        let parent = target.parentNode;
        parent.insertBefore(resizeDiv, target);
        parent.insertBefore(document.createComment(BEGIN_TAG), resizeDiv);
        parent.insertBefore(document.createComment(END_TAG), resizeDiv.nextSibling);

        resizeDiv.style.position = 'relative';
        resizeDiv.style.display = 'inline-flex';
        resizeDiv.contentEditable = 'false';
        resizeDiv.addEventListener('click', this.stopEvent);
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
        div.style.pointerEvents = 'none';
        return resizeDiv;
    }

    private stopEvent = (e: UIEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    private removeResizeDiv(resizeDiv: HTMLElement) {
        if (this.editor && this.editor.contains(resizeDiv)) {
            [resizeDiv.previousSibling, resizeDiv.nextSibling].forEach(comment => {
                if (comment && comment.nodeType == NodeType.Comment) {
                    this.editor.deleteNode(comment);
                }
            });
            this.editor.deleteNode(resizeDiv);
        }
    }

    private removeResizeDivIfAny = (img: HTMLImageElement) => {
        let div = img && (img.parentNode as HTMLElement);
        let previous = div && div.previousSibling;
        let next = div && div.nextSibling;
        if (
            previous &&
            previous.nodeType == NodeType.Comment &&
            previous.nodeValue == BEGIN_TAG &&
            next &&
            next.nodeType == NodeType.Comment &&
            next.nodeValue == END_TAG
        ) {
            div.parentNode.insertBefore(img, div);
            this.removeResizeDiv(div);
        }
    };

    private onBlur = (e: FocusEvent) => {
        this.hideResizeHandle();
    };

    private extractHtml(html: string): string {
        return html.replace(EXTRACT_HTML_REGEX, (...groups: string[]) => {
            return groups[1].replace(
                /(\s*contenteditable="false"(\/?>)|contenteditable="false"\s*)/im,
                '$2'
            );
        });
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

    private onDragStart = (e: DragEvent) => {
        if ((e.srcElement || e.target) == this.getSelectedImage()) {
            this.hideResizeHandle(true);
        }
    };
}

/**
 * @deprecated Use ImageResize instead
 */
export class ImageResizePlugin extends ImageResize {
    /**
     * @deprecated Use ImageResize instead
     */
    constructor(
        minWidth: number = 10,
        minHeight: number = 10,
        selectionBorderColor: string = '#DB626C',
        forcePreserveRatio: boolean = false
    ) {
        super(minWidth, minHeight, selectionBorderColor, forcePreserveRatio);
        console.warn('ImageResizePlugin class is deprecated. Use ImageResize class instead');
    }
}
