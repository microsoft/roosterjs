import { fromHtml, getEntitySelector } from 'roosterjs-editor-dom';
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
    QueryScope,
} from 'roosterjs-editor-types';

const DELETE_KEYCODE = 46;
const BACKSPACE_KEYCODE = 8;
const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

const ENTITY_TYPE = 'IMAGE_CROP_WRAPPER';

interface CroppedImage {
    originalSource: string;
    hiddenTop: number;
    hiddenRight: number;
    hiddenBottom: number;
    hiddenLeft: number;
    width: number;
    height: number;
}

/**
 * ImageCrop plugin provides the ability to crop an inline image in editor
 */
export default class ImageCrop implements EditorPlugin {
    private editor: IEditor;
    private startPageX: number;
    private startPageY: number;
    private startWidth: number;
    private startHeight: number;
    private cropDiv: HTMLElement;
    private direction: string;
    private hiddenLeft = 0;
    private hiddenRight = 0;
    private hiddenTop = 0;
    private hiddenBottom = 0;
    private divOverlayLeft: HTMLElement;
    private divOverlayTop: HTMLElement;
    private divOverlayRight: HTMLElement;
    private divOverlayBottom: HTMLElement;
    private mapCroppedImages: Map<string, CroppedImage>;
    private disposer: () => void;

    /**
     * Create a new instance of ImageCrop
     * @param minWidth Minimum width of image when crop in pixel, default value is 10
     * @param minHeight Minimum height of image when crop in pixel, default value is 10
     * @param cropHandlesColor Color of crop handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when crop, default value is false
     * //@param croppableImageSelector Selector for picking which image is resizable (e.g. for all images not placeholders), note
     * that the tag must be IMG regardless what the selector is
     */
    constructor(
        private minWidth: number = 10,
        private minHeight: number = 10,
        private cropHandlesColor: string = '#DB626C',
        private cropOverlayColor: string = 'rgba(0,0,0,.5)'
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageCrop';
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
        this.hideCropHandle();
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.StartCrop) {
            //should event be a feault one with data??
            const images = this.editor.queryElements('img', QueryScope.InSelection);
            const selectedImage = images[0] as HTMLImageElement;

            if (selectedImage) {
                if (this.mapCroppedImages?.has(selectedImage.src)) {
                    this.retrieveCroppedImage(selectedImage);
                } else {
                    this.startWidth = selectedImage.clientWidth;
                    this.startHeight = selectedImage.clientHeight;
                }

                if (!this.cropDiv) {
                    this.showCropHandle(<HTMLImageElement>selectedImage);
                }
            } else if (this.cropDiv) {
                this.hideCropHandle();
            }
        } else if (e.eventType == PluginEventType.MouseDown && this.cropDiv) {
            this.hideCropHandle();
        } else if (e.eventType == PluginEventType.KeyDown && this.cropDiv) {
            const event = e.rawEvent;
            if (event.which == DELETE_KEYCODE || event.which == BACKSPACE_KEYCODE) {
                this.editor.addUndoSnapshot(() => {
                    this.editor.deleteNode(this.cropDiv);
                });
                this.cropDiv = null;
                event.preventDefault();
            } else if (
                event.which != SHIFT_KEYCODE &&
                event.which != CTRL_KEYCODE &&
                event.which != ALT_KEYCODE
            ) {
                this.hideCropHandle(true /*selectImage*/);
            }
        } else if (
            e.eventType == PluginEventType.ContentChanged &&
            e.source != ChangeSource.ImageCrop &&
            (e.source != ChangeSource.InsertEntity || (<Entity>e.data)?.type != ENTITY_TYPE)
        ) {
            this.editor.queryElements(getEntitySelector(ENTITY_TYPE), this.removeCropDiv);
            this.cropDiv = null;
        } else if (e.eventType == PluginEventType.EntityOperation && e.entity.type == ENTITY_TYPE) {
            if (e.operation == EntityOperation.ReplaceTemporaryContent) {
                this.removeCropDiv(e.entity.wrapper);
            } else if (e.operation == EntityOperation.Click) {
                this.stopEvent(e.rawEvent);
            }
        }
    }

    retrieveCroppedImage(selectedImage: HTMLImageElement) {
        let croppedImage = this.mapCroppedImages.get(selectedImage.src);

        // Calculate scale in case image has been resized after previous crop
        let scaleWidth = selectedImage.width / selectedImage.naturalWidth;
        let scaleHeight = selectedImage.height / selectedImage.naturalHeight;

        selectedImage.src = croppedImage.originalSource;

        selectedImage.style.width = Math.floor(croppedImage.width * scaleWidth) + 'px';
        selectedImage.style.height = Math.floor(croppedImage.height * scaleHeight) + 'px';
        selectedImage.width = Math.floor(croppedImage.width * scaleWidth);
        selectedImage.height = Math.floor(croppedImage.height * scaleHeight);

        this.hiddenTop = Math.floor(croppedImage.hiddenTop * scaleHeight);
        this.hiddenRight = Math.floor(croppedImage.hiddenRight * scaleWidth);
        this.hiddenBottom = Math.floor(croppedImage.hiddenBottom * scaleHeight);
        this.hiddenLeft = Math.floor(croppedImage.hiddenLeft * scaleWidth);

        this.startWidth = Math.floor(croppedImage.width * scaleWidth);
        this.startHeight = Math.floor(croppedImage.height * scaleHeight);
    }

    /**
     * Show the crop handle for an image
     * @param img The IMG element to crop
     */
    showCropHandle(img: HTMLImageElement) {
        this.cropDiv = this.createCropDiv(img);
        this.createCropOverlay();
        this.setOverlaySize();
        this.editor.select(this.cropDiv, PositionType.After);
    }

    /**
     * Hide crop handle of current selected image
     * @param selectImageAfterUnSelect Optional, when set to true, select the image element after hide the crop handle
     */
    hideCropHandle(selectImageAfterUnSelect?: boolean) {
        if (this.cropDiv) {
            this.actuallyCrop();
            const transform = this.cropDiv.style.transform;
            const img = this.removeCropDiv(this.cropDiv);
            img.style.transform = transform;

            if (selectImageAfterUnSelect) {
                this.editor.select(img);
            } else {
                this.editor.select(img, PositionType.After);
            }

            this.cropDiv = null;
        }
    }

    private startAdjustCrop = (e: MouseEvent) => {
        this.startPageX = e.pageX;
        this.startPageY = e.pageY;

        let document = this.editor.getDocument();
        document.addEventListener('mousemove', this.doAdjustCrop, true /*useCapture*/);
        document.addEventListener('mouseup', this.finishAdjustCrop, true /*useCapture*/);
        this.direction = (<HTMLElement>(e.srcElement || e.target)).style.cursor;

        this.stopEvent(e);
    };

    private doAdjustCrop = (e: MouseEvent) => {
        let widthChange = this.startPageX - e.pageX;
        let heightChange = this.startPageY - e.pageY;

        if (this.direction == 'se-resize') {
            this.hiddenRight = Math.min(
                this.hiddenRight + widthChange,
                this.startWidth - this.hiddenLeft - this.minWidth
            );

            this.hiddenBottom = Math.min(
                this.hiddenBottom + heightChange,
                this.startHeight - this.hiddenTop - this.minHeight
            );
        } else if (this.direction == 'ne-resize') {
            this.hiddenRight = Math.min(
                this.hiddenRight + widthChange,
                this.startWidth - this.hiddenLeft - this.minWidth
            );

            this.hiddenTop = Math.min(
                this.hiddenTop - heightChange,
                this.startHeight - this.hiddenBottom - this.minHeight
            );
        } else if (this.direction == 'nw-resize') {
            this.hiddenLeft = Math.min(
                this.hiddenLeft - widthChange,
                this.startWidth - this.hiddenRight - this.minWidth
            );

            this.hiddenTop = Math.min(
                this.hiddenTop - heightChange,
                this.startHeight - this.hiddenBottom - this.minHeight
            );
        } else if (this.direction == 'sw-resize') {
            this.hiddenLeft = Math.min(
                this.hiddenLeft - widthChange,
                this.startWidth - this.hiddenRight - this.minWidth
            );

            this.hiddenBottom = Math.min(
                this.hiddenBottom + heightChange,
                this.startHeight - this.hiddenTop - this.minHeight
            );
        }

        this.startPageX = e.pageX;
        this.startPageY = e.pageY;

        this.setOverlaySize();
        this.positionCropHandles();

        this.stopEvent(e);
    };

    private finishAdjustCrop = (e: MouseEvent) => {
        if (this.editor) {
            let document = this.editor.getDocument();
            document.removeEventListener('mousemove', this.doAdjustCrop, true /*useCapture*/);
            document.removeEventListener('mouseup', this.finishAdjustCrop, true /*useCapture*/);
        }
        this.direction = null;
        this.stopEvent(e);
    };

    private createCropDiv(target: HTMLElement) {
        const { wrapper } = insertEntity(
            this.editor,
            ENTITY_TYPE,
            target,
            false /*isBlock*/,
            true /*isReadonly*/
        );

        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-flex';

        const html = ['nw', 'ne', 'sw', 'se']
            .map(
                pos =>
                    `<div id=${pos}-handle>
                    <div style="position:absolute;width:2px;height:16px;background-color:${
                        this.cropHandlesColor
                    };cursor:${pos}-resize;${this.isNorth(pos) ? 'top:' : 'bottom:'}${
                        this.isNorth(pos) ? this.hiddenTop : this.hiddenBottom
                    }px;${this.isWest(pos) ? 'left:' : 'right:'}${
                        this.isWest(pos) ? this.hiddenLeft : this.hiddenRight
                    }px"></div><div style="position:absolute;width:16px;height:2px;background-color:${
                        this.cropHandlesColor
                    };cursor:${pos}-resize;${this.isNorth(pos) ? 'top:' : 'bottom:'}${
                        this.isNorth(pos) ? this.hiddenTop : this.hiddenBottom
                    }px;${this.isWest(pos) ? 'left:' : 'right:'}${
                        this.isWest(pos) ? this.hiddenLeft : this.hiddenRight
                    }px"></div></div>`
            )
            .join('');

        fromHtml(html, this.editor.getDocument()).forEach(div => {
            wrapper?.appendChild(div);
            div.addEventListener('mousedown', this.startAdjustCrop);
        });

        //If the cropDiv's image has a transform, apply it to the container
        const selectedImage = this.getSelectedImage(wrapper);
        if (selectedImage && selectedImage.style && selectedImage.style.transform) {
            wrapper.style.transform = selectedImage.style.transform;
            selectedImage.style.transform = '';
        }

        this.createCropOverlay();
        this.setOverlaySize();

        return wrapper;
    }

    private positionCropHandles() {
        ['nw', 'ne', 'sw', 'se'].forEach(pos => {
            let divHandle = document.getElementById(`${pos}-handle`);
            let divHandleChildren = divHandle.children;
            if (this.isNorth(pos)) {
                (divHandleChildren[0] as HTMLElement).style.top = this.hiddenTop + 'px';
                (divHandleChildren[1] as HTMLElement).style.top = this.hiddenTop + 'px';
            } else {
                (divHandleChildren[0] as HTMLElement).style.bottom = this.hiddenBottom + 'px';
                (divHandleChildren[1] as HTMLElement).style.bottom = this.hiddenBottom + 'px';
            }
            if (this.isWest(pos)) {
                (divHandleChildren[0] as HTMLElement).style.left = this.hiddenLeft + 'px';
                (divHandleChildren[1] as HTMLElement).style.left = this.hiddenLeft + 'px';
            } else {
                (divHandleChildren[0] as HTMLElement).style.right = this.hiddenRight + 'px';
                (divHandleChildren[1] as HTMLElement).style.right = this.hiddenRight + 'px';
            }
        });
    }

    private createCropOverlay() {
        this.divOverlayLeft = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divOverlayLeft);
        this.divOverlayLeft.style.position = 'absolute';
        this.divOverlayLeft.style.top = '0';
        this.divOverlayLeft.style.left = '0';
        this.divOverlayLeft.style.background = this.cropOverlayColor;

        this.divOverlayTop = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divOverlayTop);
        this.divOverlayTop.style.position = 'absolute';
        this.divOverlayTop.style.top = '0';
        this.divOverlayTop.style.background = this.cropOverlayColor;

        this.divOverlayRight = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divOverlayRight);
        this.divOverlayRight.style.position = 'absolute';
        this.divOverlayRight.style.top = '0';
        this.divOverlayRight.style.right = '0';
        this.divOverlayRight.style.background = this.cropOverlayColor;

        this.divOverlayBottom = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divOverlayBottom);
        this.divOverlayBottom.style.position = 'absolute';
        this.divOverlayBottom.style.bottom = '0';
        this.divOverlayBottom.style.background = this.cropOverlayColor;
    }

    private setOverlaySize() {
        this.divOverlayTop.style.left = this.hiddenLeft + 'px';
        this.divOverlayBottom.style.left = this.hiddenLeft + 'px';

        this.divOverlayLeft.style.width = this.hiddenLeft + 'px';
        this.divOverlayLeft.style.height = this.startHeight + 'px';

        this.divOverlayTop.style.width = `${
            this.startWidth - this.hiddenLeft - this.hiddenRight
        }px`;
        this.divOverlayTop.style.height = this.hiddenTop + 'px';

        this.divOverlayRight.style.width = this.hiddenRight + 'px';
        this.divOverlayRight.style.height = this.startHeight + 'px';

        this.divOverlayBottom.style.width = `${
            this.startWidth - this.hiddenLeft - this.hiddenRight
        }px`;
        this.divOverlayBottom.style.height = this.hiddenBottom + 'px';
    }

    private removeCropDiv = (cropDiv: HTMLElement): HTMLImageElement => {
        const img = cropDiv?.querySelector('img');
        cropDiv?.parentNode?.insertBefore(img, cropDiv);
        cropDiv?.parentNode?.removeChild(cropDiv);

        return img;
    };

    private actuallyCrop() {
        let img = this.getSelectedImage() as HTMLImageElement;

        let canvas = document.createElement('canvas');
        canvas.id = 'canvasDiv';
        let unscaledCropWidth =
            (this.startWidth - this.hiddenLeft - this.hiddenRight) /
            (this.startWidth / img.naturalWidth);
        let unscaledCropHeight =
            (this.startHeight - this.hiddenTop - this.hiddenBottom) /
            (this.startHeight / img.naturalHeight);

        let resizedCropWidth = this.startWidth - this.hiddenLeft - this.hiddenRight;
        let resizedCropHeight = this.startHeight - this.hiddenTop - this.hiddenBottom;

        canvas.setAttribute('width', resizedCropWidth.toString());
        canvas.setAttribute('height', resizedCropHeight.toString());

        let context = canvas.getContext('2d');

        context.drawImage(
            img,
            this.hiddenLeft / (this.startWidth / img.naturalWidth),
            this.hiddenTop / (this.startHeight / img.naturalHeight),
            unscaledCropWidth,
            unscaledCropHeight,
            0,
            0,
            resizedCropWidth,
            resizedCropHeight
        );

        if (!this.mapCroppedImages) {
            this.mapCroppedImages = new Map();
        }
        this.mapCroppedImages?.set(canvas.toDataURL(), {
            originalSource: img.src,
            hiddenTop: this.hiddenTop,
            hiddenRight: this.hiddenRight,
            hiddenBottom: this.hiddenBottom,
            hiddenLeft: this.hiddenLeft,
            width: img.width,
            height: img.height,
        });

        img.src = canvas.toDataURL();
        img.style.width = resizedCropWidth + 'px';
        img.style.height = resizedCropHeight + 'px';
        img.width = resizedCropWidth;
        img.height = resizedCropHeight;

        this.hiddenLeft = 0;
        this.hiddenRight = 0;
        this.hiddenTop = 0;
        this.hiddenBottom = 0;

        this.editor.addUndoSnapshot();
        this.editor.triggerContentChangedEvent(ChangeSource.ImageCrop);
    }

    private onDragStart = (e: DragEvent) => {
        if ((e.srcElement || e.target) == this.getSelectedImage()) {
            this.hideCropHandle(true);
        }
    };

    private onBlur = (e: FocusEvent) => {
        this.hideCropHandle();
    };

    private getSelectedImage(div?: HTMLElement): HTMLElement {
        const divWithImage = div || this.cropDiv;
        return divWithImage ? <HTMLElement>divWithImage.getElementsByTagName('IMG')[0] : null;
    }

    private stopEvent = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
    };

    private isNorth(direction: string): boolean {
        return direction && direction.substr(0, 1) == 'n';
    }

    private isWest(direction: string): boolean {
        return direction && direction.substr(1, 1) == 'w';
    }
}
