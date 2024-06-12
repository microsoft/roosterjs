import { applyChange } from './utils/applyChange';
import { canRegenerateImage } from './utils/canRegenerateImage';
import { checkIfImageWasResized, isASmallImage } from './utils/imageEditUtils';
import { createImageWrapper } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api/lib';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getEditInfoMetadata } from './utils/updateImageEditInfo';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getSelectedContentModelImage } from './utils/getSelectedContentModelImage';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { isElementOfType, isNodeOfType, toArray, unwrap } from 'roosterjs-content-model-dom';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';

import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    ContentModelImage,
    DOMInsertPoint,
    //DOMSelection,
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    ImageMetadataFormat,
    PluginEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: Partial<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
    preserveRatio: true,
    disableRotate: false,
    disableSideResize: false,
    onSelectState: 'resize',
};

const IMAGE_EDIT_CHANGE_SOURCE = 'ImageEdit';

/**
 * ImageEdit plugin handles the following image editing features:
 * - Resize image
 * - Crop image
 * - Rotate image
 * - Flip image
 */
export class ImageEditPlugin implements ImageEditor, EditorPlugin {
    protected editor: IEditor | null = null;
    private shadowSpan: HTMLSpanElement | null = null;
    private selectedImage: HTMLImageElement | null = null;
    public wrapper: HTMLSpanElement | null = null;
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
    private disposer: (() => void) | null = null;

    constructor(protected options: ImageEditOptions = DefaultOptions) {}

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
        this.disposer = editor.attachDomEvent({
            // blur: {
            //     beforeDispatch: () => {
            //         this.formatImageWithContentModel(
            //             editor,
            //             true /* shouldSelectImage */,
            //             true /* shouldSelectAsImageSelection*/
            //         );
            //     },
            // },
        });
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
        this.cleanInfo();
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'selectionChanged':
                {
                    const previousSelection = event.previousSelection;
                    if (previousSelection?.type == 'image' && this.shadowSpan) {
                        const previousImage = previousSelection.image;
                        if (previousImage) {
                            this.formatImageWhenSelectionChange(this.editor);
                        }
                    }
                }
                break;
            case 'mouseUp':
                {
                    const domSelection = this.editor.getDOMSelection();
                    if (
                        domSelection?.type == 'image' &&
                        event.isClicking &&
                        event.rawEvent.button == 0
                    ) {
                        this.startRotateAndResize(this.editor, domSelection.image);
                    }
                }
                break;
        }
    }

    private startEditing(
        editor: IEditor,
        image: HTMLImageElement,
        contentModelImage: ContentModelImage,
        apiOperation?: ImageEditOperation
    ) {
        const imageSpan = image.parentElement;

        if (
            !imageSpan ||
            (imageSpan && !isElementOfType(imageSpan, 'span')) ||
            image.width <= 0 ||
            image.height <= 0
        ) {
            return false;
        }
        this.imageEditInfo = getEditInfoMetadata(image, contentModelImage);
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
            imageSpan,
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

        editor.setEditorStyle('imageEdit', `outline-style:none!important;`, [
            `span:has(>img#${image.id})`,
        ]);

        return this.shadowSpan;
    }

    public startRotateAndResize(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation?: 'resize' | 'rotate'
    ) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            this.removeImageWrapper();
        }

        editor.formatContentModel((model, context) => {
            const modelImage = getSelectedContentModelImage(model);
            if (modelImage && !modelImage.editingWrapper) {
                const shadowSpan = this.startEditing(editor, image, modelImage, apiOperation);
                if (shadowSpan) {
                    modelImage.editingWrapper = shadowSpan;
                    return true;
                }
                return false;
            }
            return false;
        });

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
                                this.imageEditInfo,
                                this.options,
                                this.selectedImage,
                                this.clonedImage,
                                this.wrapper,
                                this.resizers
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
                                this.imageEditInfo,
                                this.options,
                                this.selectedImage,
                                this.clonedImage,
                                this.wrapper,
                                this.rotators
                            );
                            this.updateRotateHandleState(
                                editor,
                                this.selectedImage,
                                this.wrapper,
                                this.rotators,
                                this.imageEditInfo?.angleRad
                            );
                        }
                    },
                    this.zoomScale
                ),
            ];

            updateWrapper(
                this.imageEditInfo,
                this.options,
                this.selectedImage,
                this.clonedImage,
                this.wrapper,
                this.resizers
            );

            this.updateRotateHandleState(
                editor,
                this.selectedImage,
                this.wrapper,
                this.rotators,
                this.imageEditInfo?.angleRad
            );
        }
    }

    private updateRotateHandleState(
        editor: IEditor,
        image: HTMLImageElement,
        wrapper: HTMLSpanElement,
        rotators: HTMLDivElement[],
        angleRad: number | undefined
    ) {
        const viewport = editor.getVisibleViewport();
        const smallImage = isASmallImage(image.width, image.height);
        if (viewport && rotators && rotators.length > 0) {
            const rotator = rotators[0];
            const rotatorHandle = rotator.firstElementChild;
            if (
                isNodeOfType(rotatorHandle, 'ELEMENT_NODE') &&
                isElementOfType(rotatorHandle, 'div')
            ) {
                updateRotateHandle(
                    viewport,
                    angleRad ?? 0,
                    wrapper,
                    rotator,
                    rotatorHandle,
                    smallImage
                );
            }
        }
    }

    public isOperationAllowed(operation: ImageEditOperation): boolean {
        return operation === 'resize' || operation === 'rotate' || operation === 'flip';
    }

    public canRegenerateImage(image: HTMLImageElement): boolean {
        return canRegenerateImage(image);
    }

    private getEditingModelImage(editor: IEditor, image: HTMLImageElement) {
        let contentModelImage: ContentModelImage | null = null;
        editor.formatContentModel(model => {
            const modelImage = getSelectedContentModelImage(model);
            if (modelImage) {
                if (
                    modelImage.editingWrapper &&
                    this.wrapper &&
                    this.selectedImage &&
                    this.shadowSpan &&
                    this.editor &&
                    this.lastSrc &&
                    this.clonedImage
                ) {
                    const metadata = getEditInfoMetadata(image, modelImage);
                    applyChange(
                        this.editor,
                        this.selectedImage,
                        modelImage,
                        metadata,
                        this.lastSrc,
                        this.wasImageResized || this.isCropMode,
                        this.clonedImage
                    );
                }
                modelImage.editingWrapper = undefined;
                contentModelImage = modelImage;
                return true;
            }
            return false;
        });
        return contentModelImage;
    }

    public cropImage() {
        const selection = this.editor?.getDOMSelection();
        if (!this.editor || !selection || selection.type !== 'image') {
            return;
        }
        const contentModelImage = this.getEditingModelImage(this.editor, selection.image);
        if (!contentModelImage) {
            return;
        }
        this.startEditing(this.editor, selection.image, contentModelImage, 'crop');
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
                            this.imageEditInfo,
                            this.options,
                            this.selectedImage,
                            this.clonedImage,
                            this.wrapper,
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
            this.imageEditInfo,
            this.options,
            this.selectedImage,
            this.clonedImage,
            this.wrapper,
            undefined,
            this.croppers
        );
    }

    private editImage(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation,
        operation: (imageEditInfo: ImageMetadataFormat) => void
    ) {
        editor.formatContentModel(
            model => {
                const imageModel = getSelectedContentModelImage(model);
                if (imageModel) {
                    const imageEditInfo = getEditInfoMetadata(image, imageModel);
                    if (imageModel.editingWrapper && this.lastSrc && this.clonedImage) {
                        applyChange(
                            editor,
                            image,
                            imageModel,
                            imageEditInfo,
                            this.lastSrc,
                            this.wasImageResized || this.isCropMode,
                            this.clonedImage
                        );
                    }
                    if (this.wrapper && this.selectedImage && this.shadowSpan) {
                        image = this.removeImageWrapper() ?? image;
                    }
                    this.startEditing(editor, image, imageModel, apiOperation);
                    if (
                        !this.selectedImage ||
                        !this.imageEditInfo ||
                        !this.wrapper ||
                        !this.clonedImage ||
                        !this.lastSrc
                    ) {
                        return false;
                    }

                    operation(this.imageEditInfo);

                    updateWrapper(
                        this.imageEditInfo,
                        this.options,
                        this.selectedImage,
                        this.clonedImage,
                        this.wrapper
                    );

                    applyChange(
                        editor,
                        this.selectedImage,
                        imageModel,
                        this.imageEditInfo,
                        this.lastSrc,
                        this.wasImageResized || this.isCropMode,
                        this.clonedImage
                    );
                    imageModel.isSelected = true;
                    imageModel.isSelectedAsImageSelection = true;
                    imageModel.editingWrapper = undefined;
                    return true;
                }
                return false;
            },
            {
                changeSource: IMAGE_EDIT_CHANGE_SOURCE,
            }
        );
    }

    private cleanInfo() {
        this.editor?.setEditorStyle('imageEdit', null);
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

    // private formatImageWithContentModel(
    //     editor: IEditor,
    //     shouldSelectImage: boolean,
    //     shouldSelectAsImageSelection: boolean
    // ) {
    //     if (
    //         this.lastSrc &&
    //         this.selectedImage &&
    //         this.imageEditInfo &&
    //         this.clonedImage &&
    //         this.shadowSpan
    //     ) {
    //         editor.formatContentModel(
    //             model => {
    //                 const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
    //                     model,
    //                     false
    //                 );
    //                 if (!selectedSegmentsAndParagraphs[0]) {
    //                     return false;
    //                 }

    //                 const segment = selectedSegmentsAndParagraphs[0][0];
    //                 const paragraph = selectedSegmentsAndParagraphs[0][1];

    //                 if (paragraph && segment.segmentType == 'Image') {
    //                     mutateSegment(paragraph, segment, image => {
    //                         if (
    //                             this.lastSrc &&
    //                             this.selectedImage &&
    //                             this.imageEditInfo &&
    //                             this.clonedImage
    //                         ) {
    //                             applyChange(
    //                                 editor,
    //                                 this.selectedImage,
    //                                 image,
    //                                 this.imageEditInfo,
    //                                 this.lastSrc,
    //                                 this.wasImageResized || this.isCropMode,
    //                                 this.clonedImage
    //                             );
    //                             image.isSelected = shouldSelectImage;
    //                             image.isSelectedAsImageSelection = shouldSelectAsImageSelection;
    //                             image.isEditing = undefined;
    //                         }
    //                     });

    //                     this.cleanInfo();
    //                     return true;
    //                 }

    //                 return false;
    //             },
    //             {
    //                 changeSource: IMAGE_EDIT_CHANGE_SOURCE,
    //             }
    //         );
    //     }
    // }

    private formatImageWhenSelectionChange(editor: IEditor) {
        const { selectedImage, imageEditInfo, lastSrc, clonedImage } = this;

        if (
            selectedImage?.parentNode &&
            lastSrc &&
            imageEditInfo &&
            clonedImage &&
            this.shadowSpan
        ) {
            const parent = selectedImage.parentNode;
            const index = toArray(parent.childNodes).indexOf(selectedImage);
            const domIp: DOMInsertPoint = {
                node: parent,
                offset: index,
            };
            formatInsertPointWithContentModel(editor, domIp, (model, context, insertPoint) => {
                if (insertPoint) {
                    const { paragraph, marker } = insertPoint;
                    const markerIndex = paragraph.segments.indexOf(marker);
                    const image = paragraph.segments[markerIndex + 1];

                    if (markerIndex >= 0 && image?.segmentType == 'Image') {
                        applyChange(
                            editor,
                            selectedImage,
                            image,
                            imageEditInfo,
                            lastSrc,
                            this.wasImageResized || this.isCropMode,
                            clonedImage
                        );

                        image.editingWrapper = undefined;
                        return true;
                    }
                }

                return false;
            });

            this.cleanInfo();
        }
    }

    private removeImageWrapper() {
        let image: HTMLImageElement | null = null;
        if (this.shadowSpan && this.shadowSpan.parentElement) {
            if (
                this.shadowSpan.firstElementChild &&
                isNodeOfType(this.shadowSpan.firstElementChild, 'ELEMENT_NODE') &&
                isElementOfType(this.shadowSpan.firstElementChild, 'img')
            ) {
                image = this.shadowSpan.firstElementChild;
            }
            unwrap(this.shadowSpan);
            this.shadowSpan = null;
            this.wrapper = null;
        }

        return image;
    }

    public flipImage(direction: 'horizontal' | 'vertical') {
        const selection = this.editor?.getDOMSelection();
        if (!this.editor || !selection || selection.type !== 'image') {
            return;
        }
        const image = selection.image;
        if (this.editor) {
            this.editImage(this.editor, image, 'flip', imageEditInfo => {
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
    }

    public rotateImage(angleRad: number) {
        const selection = this.editor?.getDOMSelection();
        if (!this.editor || !selection || selection.type !== 'image') {
            return;
        }
        const image = selection.image;
        if (this.editor) {
            this.editImage(this.editor, image, 'rotate', imageEditInfo => {
                imageEditInfo.angleRad = (imageEditInfo.angleRad || 0) + angleRad;
            });
        }
    }

    //EXPOSED FOR TEST ONLY
    public getWrapper() {
        return this.wrapper;
    }
}
