import { contains, fromHtml, getEntitySelector, getTagOfNode, toArray } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-api';
import {
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
    EntityOperation,
    Entity,
} from 'roosterjs-editor-types';

const DELETE_KEYCODE = 46;
const BACKSPACE_KEYCODE = 8;
const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

const ENTITY_TYPE = 'IMAGE_RESIZE_WRAPPER';

/**
 * ImageResize plugin provides the ability to resize an inline image in editor
 */
export default class ImageResize implements EditorPlugin {
    private editor: IEditor;
    private startPageX: number;
    private startPageY: number;
    private startWidth: number;
    private startHeight: number;
    private resizeDiv: HTMLElement;
    private direction: string;
    private disposer: () => void;

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

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageResize';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = editor.addDomEventHandler({
            dragstart: this.onDragStart,
            blur: this.onBlur,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.hideResizeHandle();
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.MouseDown) {
            const event = e.rawEvent;
            const target = <HTMLElement>(event.srcElement || event.target);

            if (getTagOfNode(target) == 'IMG') {
                const parent = target.parentNode as HTMLElement;
                const elements = parent
                    ? toArray(parent.querySelectorAll(this.resizableImageSelector))
                    : [];
                if (elements.indexOf(target) < 0) {
                    return;
                }

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
                    this.editor.deleteNode(this.resizeDiv);
                });
                this.resizeDiv = null;
                event.preventDefault();
            } else if (
                event.which != SHIFT_KEYCODE &&
                event.which != CTRL_KEYCODE &&
                event.which != ALT_KEYCODE
            ) {
                this.hideResizeHandle(true /*selectImage*/);
            }
        } else if (
            e.eventType == PluginEventType.ContentChanged &&
            e.source != ChangeSource.ImageResize &&
            (e.source != ChangeSource.InsertEntity || (<Entity>e.data)?.type != ENTITY_TYPE)
        ) {
            this.editor.queryElements(getEntitySelector(ENTITY_TYPE), this.removeResizeDiv);
            this.resizeDiv = null;
        } else if (e.eventType == PluginEventType.EntityOperation && e.entity.type == ENTITY_TYPE) {
            if (e.operation == EntityOperation.ReplaceTemporaryContent) {
                this.removeResizeDiv(e.entity.wrapper);
            } else if (e.operation == EntityOperation.Click) {
                this.stopEvent(e.rawEvent);
            }
        }
    }

    /**
     * Select a given IMG element, show the resize handle
     * @param img The IMG element to select
     */
    showResizeHandle(img: HTMLImageElement) {
        this.resizeDiv = this.createResizeDiv(img);
        this.editor.select(this.resizeDiv, PositionType.After);
    }

    /**
     * Hide resize handle of current selected image
     * @param selectImageAfterUnSelect Optional, when set to true, select the image element after hide the resize handle
     */
    hideResizeHandle(selectImageAfterUnSelect?: boolean) {
        if (this.resizeDiv) {
            const transform = this.resizeDiv.style.transform;
            const img = this.removeResizeDiv(this.resizeDiv);
            img.style.transform = transform;

            if (selectImageAfterUnSelect) {
                this.editor.select(img);
            }

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

            // double check
            if (this.forcePreserveRatio || e.shiftKey) {
                let ratio =
                    this.startWidth > 0 && this.startHeight > 0
                        ? (this.startWidth * 1.0) / this.startHeight
                        : 0;

                const clientWidth = Math.floor(img.clientWidth);
                const clientHeight = Math.floor(img.clientHeight);
                newWidth = Math.floor(newWidth);
                newHeight = Math.floor(newHeight);
                if (clientHeight !== newHeight || clientWidth !== newWidth) {
                    if (clientHeight < newHeight) {
                        newWidth = clientHeight * ratio;
                    } else {
                        newHeight = clientWidth / ratio;
                    }
                    img.style.width = newWidth + 'px';
                    img.style.height = newHeight + 'px';
                }
            }
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
        this.editor.triggerContentChangedEvent(ChangeSource.ImageResize, img);
        this.stopEvent(e);
    };

    private createResizeDiv(target: HTMLElement) {
        const { wrapper } = insertEntity(
            this.editor,
            ENTITY_TYPE,
            target,
            false /*isBlock*/,
            true /*isReadonly*/
        );

        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-flex';

        const html =
            ['nw', 'ne', 'sw', 'se']
                .map(
                    pos =>
                        `<div style="position:absolute;width:7px;height:7px;background-color: ${
                            this.selectionBorderColor
                        };cursor: ${pos}-resize;${this.isNorth(pos) ? 'top' : 'bottom'}:-3px;${
                            this.isWest(pos) ? 'left' : 'right'
                        }:-3px"></div>`
                )
                .join('') +
            `<div style="position:absolute;left:0;right:0;top:0;bottom:0;border:solid 1px ${this.selectionBorderColor};pointer-events:none;"></div>`;
        fromHtml(html, this.editor.getDocument()).forEach(div => {
            wrapper.appendChild(div);
            div.addEventListener('mousedown', this.startResize);
        });

        // If the resizeDiv's image has a transform, apply it to the container
        const selectedImage = this.getSelectedImage(wrapper);
        if (selectedImage && selectedImage.style && selectedImage.style.transform) {
            wrapper.style.transform = selectedImage.style.transform;
            selectedImage.style.transform = '';
        }

        return wrapper;
    }

    private stopEvent = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
    };

    private removeResizeDiv = (resizeDiv: HTMLElement): HTMLImageElement => {
        const img = resizeDiv?.querySelector('img');
        resizeDiv?.parentNode?.insertBefore(img, resizeDiv);
        resizeDiv?.parentNode?.removeChild(resizeDiv);

        return img;
    };

    private onBlur = (e: FocusEvent) => {
        this.hideResizeHandle();
    };

    private getSelectedImage(div?: HTMLElement): HTMLElement {
        const divWithImage = div || this.resizeDiv;
        return divWithImage ? <HTMLElement>divWithImage.getElementsByTagName('IMG')[0] : null;
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
