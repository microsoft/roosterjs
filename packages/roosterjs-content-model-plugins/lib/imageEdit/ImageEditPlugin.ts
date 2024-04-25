import { applyChange } from './utils/applyChange';
import { ChangeSource } from 'roosterjs-content-model-dom';
import { checkIfImageWasResized } from './utils/imageEditUtils';
import { createImageWrapper } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getImageEditInfo } from './utils/getImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { RESIZE_IMAGE } from './constants/constants';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateWrapper } from './utils/updateWrapper';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    EditAction,
    EditorPlugin,
    IEditor,
    ImageMetadataFormat,
    PluginEvent,
    SelectionChangedEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: Partial<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
    preserveRatio: true,
    disableRotate: false,
    disableSideResize: false,
    onSelectState: 'resizeAndRotate',
};

/**
 * ImageEdit plugin handles the following image editing features:
 * - Resize image
 * - Crop image
 * - Rotate image
 * - Flip image
 */
export class ImageEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private shadowSpan: HTMLSpanElement | null = null;
    private selectedImage: HTMLImageElement | null = null;
    private wrapper: HTMLSpanElement | null = null;
    private imageEditInfo: ImageMetadataFormat | null = null;
    private imageHTMLOptions: ImageHtmlOptions | null = null;
    private dndHelpers: DragAndDropHelper<DragAndDropContext, any>[] = [];
    private clonedImage: HTMLImageElement | null = null;
    private lastSrc: string | null = null;
    private wasImageResized: boolean = false;
    private isCropMode: boolean = false;
    private resizers: HTMLDivElement[] = [];
    private rotators: HTMLDivElement[] = [];
    private croppers: HTMLDivElement[] = [];
    private zoomScale: number = 1;

    constructor(private options: ImageEditOptions = DefaultOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ImageEdit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
        this.cleanInfo();
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case 'selectionChanged':
                    this.handleSelectionChangedEvent(this.editor, event);
                    break;
                case 'contentChanged':
                    if (
                        event.source != RESIZE_IMAGE &&
                        this.selectedImage &&
                        this.imageEditInfo &&
                        this.shadowSpan
                    ) {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }
                    break;
                case 'keyDown':
                    if (this.selectedImage && this.imageEditInfo && this.shadowSpan) {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }
                    break;
                case 'editImage':
                    if (event.apiOperation?.action === 'crop') {
                        this.startCropping(this.editor, event.image);
                    }

                    if (event.apiOperation?.action === 'flip' && event.apiOperation.flipDirection) {
                        this.flipImage(this.editor, event.image, event.apiOperation.flipDirection);
                    }

                    if (
                        event.apiOperation?.action === 'rotate' &&
                        event.apiOperation.angleRad !== undefined
                    ) {
                        this.rotateImage(this.editor, event.image, event.apiOperation.angleRad);
                    }

                    if (event.apiOperation?.action === 'reset') {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }

                    if (
                        event.apiOperation?.action === 'resize' &&
                        event.apiOperation.widthPx &&
                        event.apiOperation.heightPx
                    ) {
                        this.wasImageResized = true;
                        this.resizeImage(
                            this.editor,
                            event.image,
                            event.apiOperation.widthPx,
                            event.apiOperation.heightPx
                        );
                    }

                    break;
            }
        }
    }

    private handleSelectionChangedEvent(editor: IEditor, event: SelectionChangedEvent) {
        if (event.newSelection?.type == 'image') {
            if (this.selectedImage && this.selectedImage !== event.newSelection.image) {
                this.removeImageWrapper(editor, this.dndHelpers);
            }
            if (!this.selectedImage) {
                this.startRotateAndResize(editor, event.newSelection.image);
            }
        } else if (this.selectedImage && this.imageEditInfo && this.shadowSpan) {
            this.removeImageWrapper(editor, this.dndHelpers);
        }
    }

    private startEditing(editor: IEditor, image: HTMLImageElement, apiOperation?: EditAction) {
        this.imageEditInfo = getImageEditInfo(image);
        this.lastSrc = image.getAttribute('src');
        this.imageHTMLOptions = getHTMLImageOptions(editor, this.options, this.imageEditInfo);
        const {
            resizers,
            rotators,
            wrapper,
            shadowSpan,
            imageClone,
            croppers,
        } = createImageWrapper(
            editor,
            image,
            this.options,
            this.imageEditInfo,
            this.imageHTMLOptions,
            apiOperation || this.options.onSelectState
        );
        this.shadowSpan = shadowSpan;
        this.selectedImage = image;
        this.wrapper = wrapper;
        this.clonedImage = imageClone;
        this.wasImageResized = checkIfImageWasResized(image);
        this.resizers = resizers;
        this.rotators = rotators;
        this.croppers = croppers;
        this.zoomScale = editor.getDOMHelper().calculateZoomScale();
    }

    /**
     * @internal
     * EXPORTED FOR TESTING
     */
    public startRotateAndResize(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation?: 'resize' | 'rotate'
    ) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            this.removeImageWrapper(editor, this.dndHelpers);
        }
        this.startEditing(editor, image, apiOperation);
        if (this.selectedImage && this.imageEditInfo && this.wrapper && this.clonedImage) {
            this.dndHelpers = [
                ...getDropAndDragHelpers(
                    this.wrapper,
                    this.imageEditInfo,
                    this.options,
                    ImageEditElementClass.ResizeHandle,
                    Resizer,
                    () => {
                        if (
                            this.imageEditInfo &&
                            this.selectedImage &&
                            this.wrapper &&
                            this.clonedImage
                        ) {
                            updateWrapper(
                                editor,
                                this.imageEditInfo,
                                this.options,
                                this.selectedImage,
                                this.clonedImage,
                                this.wrapper,
                                this.rotators,
                                this.resizers,
                                undefined
                            );
                            this.wasImageResized = true;
                        }
                    },
                    this.zoomScale
                ),
                ...getDropAndDragHelpers(
                    this.wrapper,
                    this.imageEditInfo,
                    this.options,
                    ImageEditElementClass.RotateHandle,
                    Rotator,
                    () => {
                        if (
                            this.imageEditInfo &&
                            this.selectedImage &&
                            this.wrapper &&
                            this.clonedImage
                        ) {
                            updateWrapper(
                                editor,
                                this.imageEditInfo,
                                this.options,
                                this.selectedImage,
                                this.clonedImage,
                                this.wrapper,
                                this.rotators,
                                this.resizers,
                                undefined
                            );
                        }
                    },
                    this.zoomScale
                ),
            ];

            updateWrapper(
                editor,
                this.imageEditInfo,
                this.options,
                this.selectedImage,
                this.clonedImage,
                this.wrapper,
                this.rotators,
                this.resizers,
                undefined
            );

            editor.setDOMSelection({
                type: 'image',
                image: image,
            });
        }
    }

    private startCropping(editor: IEditor, image: HTMLImageElement) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            this.removeImageWrapper(editor, this.dndHelpers);
        }
        this.startEditing(editor, image, 'crop');
        if (!this.selectedImage || !this.imageEditInfo || !this.wrapper || !this.clonedImage) {
            return;
        }

        this.dndHelpers = [
            ...getDropAndDragHelpers(
                this.wrapper,
                this.imageEditInfo,
                this.options,
                ImageEditElementClass.CropHandle,
                Cropper,
                () => {
                    if (
                        this.imageEditInfo &&
                        this.selectedImage &&
                        this.wrapper &&
                        this.clonedImage
                    ) {
                        updateWrapper(
                            editor,
                            this.imageEditInfo,
                            this.options,
                            this.selectedImage,
                            this.clonedImage,
                            this.wrapper,
                            undefined,
                            undefined,
                            this.croppers
                        );
                        this.isCropMode = true;
                    }
                },
                this.zoomScale
            ),
        ];

        updateWrapper(
            editor,
            this.imageEditInfo,
            this.options,
            this.selectedImage,
            this.clonedImage,
            this.wrapper,
            undefined,
            undefined,
            this.croppers
        );
    }

    private editImage(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: EditAction,
        operation: (imageEditInfo: ImageMetadataFormat) => void
    ) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            this.removeImageWrapper(editor, this.dndHelpers);
        }
        this.startEditing(editor, image, apiOperation);
        if (!this.selectedImage || !this.imageEditInfo || !this.wrapper || !this.clonedImage) {
            return;
        }

        operation(this.imageEditInfo);

        updateWrapper(
            editor,
            this.imageEditInfo,
            this.options,
            this.selectedImage,
            this.clonedImage,
            this.wrapper
        );
        this.removeImageWrapper(editor, this.dndHelpers);
    }

    private cleanInfo() {
        this.selectedImage = null;
        this.shadowSpan = null;
        this.wrapper = null;
        this.imageEditInfo = null;
        this.imageHTMLOptions = null;
        this.dndHelpers.forEach(helper => helper.dispose());
        this.dndHelpers = [];
        this.clonedImage = null;
        this.lastSrc = null;
        this.wasImageResized = false;
        this.isCropMode = false;
        this.resizers = [];
        this.rotators = [];
        this.croppers = [];
    }

    private removeImageWrapper(
        editor: IEditor,
        resizeHelpers: DragAndDropHelper<DragAndDropContext, any>[]
    ) {
        if (this.lastSrc && this.selectedImage && this.imageEditInfo && this.clonedImage) {
            applyChange(
                editor,
                this.selectedImage,
                this.imageEditInfo,
                this.lastSrc,
                this.wasImageResized || this.isCropMode,
                this.clonedImage
            );
        }

        const helper = editor.getDOMHelper();
        if (this.shadowSpan && this.shadowSpan.parentElement) {
            helper.unwrap(this.shadowSpan);
        }
        resizeHelpers.forEach(helper => helper.dispose());
        this.cleanInfo();
    }

    private flipImage(
        editor: IEditor,
        image: HTMLImageElement,
        direction: 'horizontal' | 'vertical'
    ) {
        this.editImage(editor, image, 'flip', imageEditInfo => {
            const angleRad = imageEditInfo.angleRad || 0;
            const isInVerticalPostion =
                (angleRad >= Math.PI / 2 && angleRad < (3 * Math.PI) / 4) ||
                (angleRad <= -Math.PI / 2 && angleRad > (-3 * Math.PI) / 4);
            if (isInVerticalPostion) {
                if (direction === 'horizontal') {
                    imageEditInfo.flippedVertical = !imageEditInfo.flippedVertical;
                } else {
                    imageEditInfo.flippedHorizontal = !imageEditInfo.flippedHorizontal;
                }
            } else {
                if (direction === 'vertical') {
                    imageEditInfo.flippedVertical = !imageEditInfo.flippedVertical;
                } else {
                    imageEditInfo.flippedHorizontal = !imageEditInfo.flippedHorizontal;
                }
            }
        });
    }

    private rotateImage(editor: IEditor, image: HTMLImageElement, angleRad: number) {
        this.editImage(editor, image, 'rotate', imageEditInfo => {
            imageEditInfo.angleRad = (imageEditInfo.angleRad || 0) + angleRad;
        });
    }

    private resizeImage(
        editor: IEditor,
        image: HTMLImageElement,
        widthPx: number,
        heightPx: number
    ) {
        this.editImage(editor, image, 'resize', imageEditInfo => {
            imageEditInfo.widthPx = widthPx;
            imageEditInfo.heightPx = heightPx;
            this.wasImageResized = true;
        });

        editor.triggerEvent('contentChanged', {
            source: ChangeSource.ImageResize,
        });
    }
}
