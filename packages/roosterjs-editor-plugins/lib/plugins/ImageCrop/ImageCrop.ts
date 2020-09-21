import { fromHtml } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-api';
import {
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
    //EntityOperation,
    //Entity,
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
    private divBorderLeft: HTMLElement; //make not props but reach through... id?
    private divBorderTop: HTMLElement;
    private divBorderRight: HTMLElement;
    private divBorderBottom: HTMLElement;
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
        private cropHandlesColor: string = '#DB626C' //private croppableImageSelector: string = 'img'
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
                // repopulate from map if cropped
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
            // NEED THIS BELOW??
        }
        // else if (
        //     e.eventType == PluginEventType.ContentChanged &&
        //     e.source != ChangeSource.ImageCrop &&
        //     (e.source != ChangeSource.InsertEntity || (<Entity>e.data)?.type != ENTITY_TYPE)
        // ) {
        //     this.editor.queryElements(getEntitySelector(ENTITY_TYPE), this.removeCropDiv);
        //     this.cropDiv = null;
        // } else if (e.eventType == PluginEventType.EntityOperation && e.entity.type == ENTITY_TYPE) {
        //     if (e.operation == EntityOperation.ReplaceTemporaryContent) {
        //         this.removeCropDiv(e.entity.wrapper);
        //     } else if (e.operation == EntityOperation.Click) {
        //         this.stopEvent(e.rawEvent);
        //     }
        //}
    }

    retrieveCroppedImage(selectedImage: HTMLImageElement) {
        let croppedImage = this.mapCroppedImages.get(selectedImage.src); //or should I make THIS the this object?

        // Calculate scale if image is resized
        let scaleWidth = selectedImage.width / selectedImage.naturalWidth;
        let scaleHeight = selectedImage.height / selectedImage.naturalHeight;

        selectedImage.src = croppedImage.originalSource;
        // MAYBE create new image instead of adjust??
        // selectedImage.style.width = croppedImage.width + 'px';
        // selectedImage.style.height = croppedImage.height + 'px';
        // selectedImage.width = croppedImage.width;
        // selectedImage.height = croppedImage.height;

        selectedImage.style.width = croppedImage.width * scaleWidth + 'px';
        selectedImage.style.height = croppedImage.height * scaleHeight + 'px';
        selectedImage.width = croppedImage.width * scaleWidth;
        selectedImage.height = croppedImage.height * scaleHeight;

        //selectedImage.onload = () => {
        // console.log(
        //     '#2 - Cropped image original source is: ' +
        //         croppedImage.originalSource.substr(0, 200)
        // );

        this.hiddenTop = croppedImage.hiddenTop * scaleHeight;
        this.hiddenRight = croppedImage.hiddenRight * scaleWidth;
        this.hiddenBottom = croppedImage.hiddenBottom * scaleHeight;
        this.hiddenLeft = croppedImage.hiddenLeft * scaleWidth;

        //this.startWidth = selectedImage.clientWidth;
        this.startWidth = croppedImage.width;

        //this.startHeight = selectedImage.clientHeight;
        this.startHeight = croppedImage.height;
        //}
    }

    /**
     * Select a given IMG element, show the resize handle
     * @param img The IMG element to select
     */
    showCropHandle(img: HTMLImageElement) {
        this.cropDiv = this.createCropDiv(img);
        this.createCropOverlay();
        this.setOverlaySize();
        this.editor.select(this.cropDiv, PositionType.After);
    }

    /**
     * Hide resize handle of current selected image
     * @param selectImageAfterUnSelect Optional, when set to true, select the image element after hide the resize handle
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
        let img = this.getSelectedImage();
        if (this.editor && img) {
            this.startPageX = e.pageX;
            this.startPageY = e.pageY;
            //this.startWidth = img.clientWidth;
            //this.startHeight = img.clientHeight;
            this.editor.addUndoSnapshot();

            let document = this.editor.getDocument();
            document.addEventListener('mousemove', this.doAdjustCrop, true /*useCapture*/);
            document.addEventListener('mouseup', this.finishAdjustCrop, true /*useCapture*/);
            this.direction = (<HTMLElement>(e.srcElement || e.target)).style.cursor;
        }

        this.stopEvent(e);
    };

    private doAdjustCrop = (e: MouseEvent) => {
        //let img = this.getSelectedImage();
        let img = <HTMLImageElement>this.getSelectedImage();

        if (this.editor && img) {
            let widthChange = this.startPageX - e.pageX; //do absolute to be same as Resize
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
        }
        this.stopEvent(e);
    };

    private finishAdjustCrop = (e: MouseEvent) => {
        var img = this.getSelectedImage() as HTMLImageElement;
        if (this.editor && img) {
            let document = this.editor.getDocument();
            document.removeEventListener('mousemove', this.doAdjustCrop, true /*useCapture*/);
            document.removeEventListener('mouseup', this.finishAdjustCrop, true /*useCapture*/);

            this.cropDiv.style.width = ''; //??
            this.cropDiv.style.height = '';
        }
        this.direction = null; //need?
        this.editor.addUndoSnapshot();
        this.editor.triggerContentChangedEvent(ChangeSource.ImageResize);
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
            wrapper.appendChild(div); //wonder if grandchild nodes get appended right?
            div.addEventListener('mousedown', this.startAdjustCrop);
        });

        //If the cropDiv's image has a transform, apply it to the container
        const selectedImage = this.getSelectedImage(wrapper);
        if (selectedImage && selectedImage.style && selectedImage.style.transform) {
            wrapper.style.transform = selectedImage.style.transform;
            selectedImage.style.transform = '';
        }

        this.createCropOverlay(); //BC crop div doesnt exist YET
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
        this.divBorderLeft = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divBorderLeft);
        this.divBorderLeft.style.position = 'absolute';
        this.divBorderLeft.style.top = '0';
        this.divBorderLeft.style.left = '0';
        this.divBorderLeft.style.background = 'rgba(0,0,0,.5)'; // no hardcode, param

        this.divBorderTop = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divBorderTop);
        this.divBorderTop.style.position = 'absolute';
        this.divBorderTop.style.top = '0';
        this.divBorderTop.style.background = 'rgba(0,0,0,.5)';

        this.divBorderRight = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divBorderRight);
        this.divBorderRight.style.position = 'absolute';
        this.divBorderRight.style.top = '0';
        this.divBorderRight.style.right = '0';
        this.divBorderRight.style.background = 'rgba(0,0,0,.5)';

        this.divBorderBottom = document.createElement('DIV');
        this.cropDiv?.appendChild(this.divBorderBottom);
        this.divBorderBottom.style.position = 'absolute';
        this.divBorderBottom.style.bottom = '0';
        this.divBorderBottom.style.background = 'rgba(0,0,0,.5)';
    }

    private setOverlaySize() {
        this.divBorderTop.style.left = this.hiddenLeft + 'px';
        this.divBorderBottom.style.left = this.hiddenLeft + 'px';

        this.divBorderLeft.style.width = this.hiddenLeft + 'px';
        //NEED TO KNOW WHAT THIS WAS FROM LAST TIME. So set up and keep as private prop and edit.
        this.divBorderLeft.style.height = this.startHeight + 'px';

        this.divBorderTop.style.width = `${this.startWidth - this.hiddenLeft - this.hiddenRight}px`;
        this.divBorderTop.style.height = this.hiddenTop + 'px';

        this.divBorderRight.style.width = this.hiddenRight + 'px';
        this.divBorderRight.style.height = this.startHeight + 'px';

        this.divBorderBottom.style.width = `${
            this.startWidth - this.hiddenLeft - this.hiddenRight
        }px`;
        this.divBorderBottom.style.height = this.hiddenBottom + 'px';
    }

    private removeCropDiv = (cropDiv: HTMLElement): HTMLImageElement => {
        const img = cropDiv?.querySelector('img');
        cropDiv?.parentNode?.insertBefore(img, cropDiv);
        cropDiv?.parentNode?.removeChild(cropDiv);

        return img;
    };

    private actuallyCrop() {
        let img = this.getSelectedImage() as HTMLImageElement; //let vs var??

        // BEING HERE CROP USING CANVAS
        let canvas = document.createElement('canvas');
        canvas.id = 'canvasDiv';
        //let cropWidth = this.startWidth - this.hiddenLeft - this.hiddenRight; // Math floor???
        let unscaledCropWidth =
            (this.startWidth - this.hiddenLeft - this.hiddenRight) /
            (this.startWidth / img.naturalWidth); // startWidth comes from Style
        //let cropHeight = this.startHeight - this.hiddenTop - this.hiddenBottom;
        let unscaledCropHeight =
            (this.startHeight - this.hiddenTop - this.hiddenBottom) /
            (this.startHeight / img.naturalHeight);

        // Calculate cropWidth is resized
        // cropW * resizedW / originalW
        //let resizedCropWidth = (unscaledCropWidth * img.width) / img.naturalWidth;
        let resizedCropWidth = this.startWidth - this.hiddenLeft - this.hiddenRight;
        //let resizedCropHeight = (unscaledCropHeight * img.height) / img.naturalHeight;
        let resizedCropHeight = this.startHeight - this.hiddenTop - this.hiddenBottom;

        //canvas.setAttribute('width', this.startWidth.toString());
        canvas.setAttribute('width', resizedCropWidth.toString());
        //canvas.setAttribute('height', this.startHeight.toString()); //maybe it doesn't matter what canvas size is?? its seems to do..
        canvas.setAttribute('height', resizedCropHeight.toString()); //maybe it doesn't matter what canvas size is?? its seems to do..

        //let parent = img.parentNode.parentNode;
        //parent.appendChild(canvas);
        let context = canvas.getContext('2d');

        context.drawImage(
            img,
            this.hiddenLeft / (this.startWidth / img.naturalWidth), //need to unscale
            this.hiddenTop / (this.startHeight / img.naturalHeight),
            unscaledCropWidth, //unscaled size here
            unscaledCropHeight,
            0,
            0,
            resizedCropWidth, //scaled size here
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
            //width: img.naturalWidth,
            height: img.height,
            //height: img.naturalHeight
        });

        img.src = canvas.toDataURL(); //instead of replacing image, set the source to be the canvas
        img.style.width = resizedCropWidth + 'px';
        img.style.height = resizedCropHeight + 'px';
        img.width = resizedCropWidth;
        img.height = resizedCropHeight;

        //this resets for next crop too
        this.hiddenLeft = 0;
        this.hiddenRight = 0;
        this.hiddenTop = 0;
        this.hiddenBottom = 0;

        //img.style.maxWidth = ''; //NEED TO SET THIS FOR MARGIN TO WORK ??

        // ***END HERE IS IT IS CSS CROP
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
