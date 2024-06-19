import { applyChange } from './utils/applyChange';
import { canRegenerateImage } from './utils/canRegenerateImage';
import { checkIfImageWasResized, isASmallImage } from './utils/imageEditUtils';
import { createImageWrapper } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { findEditingImage } from './utils/findEditingImage';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getSelectedImage } from './utils/getSelectedImage';
import { getSelectedImageMetadata, updateImageEditInfo } from './utils/updateImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { setIsEditing } from './utils/setIsEditing';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';
import type { EditableImageFormat } from './types/EditableImageFormat';
import {
    getSelectedSegmentsAndParagraphs,
    isElementOfType,
    isModifierKey,
    isNodeOfType,
    mutateSegment,
    unwrap,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    DOMSelection,
    EditorPlugin,
    FormatApplier,
    FormatParser,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    ImageMetadataFormat,
    KeyDownEvent,
    MouseUpEvent,
    PluginEvent,
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

const IMAGE_EDIT_CHANGE_SOURCE = 'ImageEdit';
const LEFT_MOUSE_BUTTON = 0;

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
    protected wrapper: HTMLSpanElement | null = null;
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
    //EXPOSED FOR TEST ONLY
    protected isEditing = false;

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
            blur: {
                beforeDispatch: () => {
                    this.formatImageWithContentModel(
                        editor,
                        true /* shouldSelectImage */,
                        true /* shouldSelectAsImageSelection*/
                    );
                },
            },
        });
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
        this.isEditing = false;
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
            case 'mouseUp':
                this.mouseUpHandler(this.editor, event);
                break;
            case 'keyDown':
                this.keyDownHandler(this.editor, event);
                break;
        }
    }

    getContentModelConfig() {
        return {
            domToModelOption: {
                additionalFormatParsers: {
                    image: [this.editingFormatParser],
                },
            },
            modelToDomOption: {
                additionalFormatAppliers: {
                    image: [this.editingFormatApplier],
                },
            },
        };
    }

    private mouseUpHandler(editor: IEditor, event: MouseUpEvent) {
        const selection = editor.getDOMSelection();

        if (
            (selection &&
                selection.type == 'image' &&
                event.rawEvent.button == LEFT_MOUSE_BUTTON) ||
            this.isEditing
        ) {
            this.selectionChangeHandler(editor, selection);
        }
    }

    private keyDownHandler(editor: IEditor, event: KeyDownEvent) {
        if (this.isEditing) {
            const selection = editor.getDOMSelection();
            if (!isModifierKey(event.rawEvent)) {
                this.selectionChangeHandler(editor, selection);
            } else if (selection?.type == 'image') {
                this.formatImageWithContentModel(
                    editor,
                    true /* shouldSelect*/,
                    true /* shouldSelectAsImageSelection*/
                );
            }
        }
    }

    private selectionChangeHandler(editor: IEditor, selection: DOMSelection | null) {
        editor.formatContentModel(model => {
            const previousSelectedImage = findEditingImage(model);
            const editingImage = getSelectedImage(model);
            const format = editingImage?.image.format as EditableImageFormat;

            let result = false;
            if (previousSelectedImage?.image != editingImage?.image) {
                const { lastSrc, selectedImage, imageEditInfo, clonedImage } = this;
                if (
                    this.isEditing &&
                    previousSelectedImage &&
                    previousSelectedImage.image !== editingImage?.image &&
                    lastSrc &&
                    selectedImage &&
                    imageEditInfo &&
                    clonedImage
                ) {
                    mutateSegment(
                        previousSelectedImage.paragraph,
                        previousSelectedImage.image,
                        image => {
                            applyChange(
                                editor,
                                selectedImage,
                                image,
                                imageEditInfo,
                                lastSrc,
                                this.wasImageResized || this.isCropMode,
                                clonedImage
                            );
                        }
                    );

                    setIsEditing(previousSelectedImage, false);
                    this.cleanInfo();
                    result = true;
                }

                this.isEditing = false;
                this.isCropMode = false;

                if (editingImage && !format.isEditing && selection?.type == 'image') {
                    setIsEditing(editingImage, true);

                    this.isEditing = true;
                    mutateSegment(editingImage.paragraph, editingImage.image, image => {
                        this.imageEditInfo = updateImageEditInfo(image, selection.image);
                    });

                    result = true;
                }
            }

            return result;
        });
    }

    private startEditing(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation?: ImageEditOperation
    ) {
        const imageSpan = image.parentElement;
        if (!imageSpan || (imageSpan && !isElementOfType(imageSpan, 'span'))) {
            return;
        }
        if (!this.imageEditInfo) {
            this.imageEditInfo = getSelectedImageMetadata(editor, image);
        }
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
            `span:has(>img#${this.selectedImage.id})`,
        ]);
    }

    public startRotateAndResize(editor: IEditor, image: HTMLImageElement) {
        if (this.imageEditInfo) {
            this.startEditing(editor, image, 'resizeAndRotate');

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
        return (
            operation === 'resize' ||
            operation === 'rotate' ||
            operation === 'flip' ||
            operation === 'crop'
        );
    }

    public canRegenerateImage(image: HTMLImageElement): boolean {
        return canRegenerateImage(image);
    }

    private startCropMode(editor: IEditor, image: HTMLImageElement) {
        if (this.imageEditInfo) {
            this.startEditing(editor, image, 'crop');
            if (this.imageEditInfo && this.selectedImage && this.wrapper && this.clonedImage) {
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
        }
    }

    public cropImage() {
        if (!this.editor) {
            return;
        }
        this.editor.focus();
        const selection = this.editor.getDOMSelection();
        if (selection?.type == 'image') {
            const image = selection.image;
            const imageSpan = image.parentElement;
            if (imageSpan && imageSpan && isElementOfType(imageSpan, 'span')) {
                this.editor.formatContentModel(model => {
                    const editingImage = getSelectedImage(model);
                    if (editingImage && editingImage.image && this.editor) {
                        setIsEditing(editingImage, true);
                        mutateSegment(editingImage.paragraph, editingImage.image, image => {
                            this.imageEditInfo = updateImageEditInfo(image, selection.image);
                        });
                        this.isEditing = true;
                        this.isCropMode = true;
                        return true;
                    }
                    return false;
                });
            }
        }
    }

    private editImage(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation,
        operation: (imageEditInfo: ImageMetadataFormat) => void
    ) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            image = this.removeImageWrapper() ?? image;
        }
        this.startEditing(editor, image, apiOperation);
        if (!this.selectedImage || !this.imageEditInfo || !this.wrapper || !this.clonedImage) {
            return;
        }

        operation(this.imageEditInfo);

        updateWrapper(
            this.imageEditInfo,
            this.options,
            this.selectedImage,
            this.clonedImage,
            this.wrapper
        );

        this.formatImageWithContentModel(
            editor,
            true /* shouldSelect*/,
            true /* shouldSelectAsImageSelection*/
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

    private formatImageWithContentModel(
        editor: IEditor,
        shouldSelectImage: boolean,
        shouldSelectAsImageSelection: boolean
    ) {
        if (
            this.lastSrc &&
            this.selectedImage &&
            this.imageEditInfo &&
            this.clonedImage &&
            this.shadowSpan
        ) {
            editor.formatContentModel(
                model => {
                    const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
                        model,
                        false
                    );
                    if (!selectedSegmentsAndParagraphs[0]) {
                        return false;
                    }

                    const segment = selectedSegmentsAndParagraphs[0][0];
                    const paragraph = selectedSegmentsAndParagraphs[0][1];

                    if (paragraph && segment.segmentType == 'Image') {
                        mutateSegment(paragraph, segment, image => {
                            if (
                                this.lastSrc &&
                                this.selectedImage &&
                                this.imageEditInfo &&
                                this.clonedImage
                            ) {
                                applyChange(
                                    editor,
                                    this.selectedImage,
                                    image,
                                    this.imageEditInfo,
                                    this.lastSrc,
                                    this.wasImageResized || this.isCropMode,
                                    this.clonedImage
                                );
                                image.isSelected = shouldSelectImage;
                                image.isSelectedAsImageSelection = shouldSelectAsImageSelection;
                                (image.format as EditableImageFormat).isEditing = false;
                                this.isEditing = false;
                                this.isCropMode = false;
                            }
                        });
                        return true;
                    }

                    return false;
                },
                {
                    changeSource: IMAGE_EDIT_CHANGE_SOURCE,
                    onNodeCreated: () => {
                        this.cleanInfo();
                    },
                }
            );
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

    private editingFormatParser: FormatParser<EditableImageFormat> = (format, image) => {
        const parent = image.parentNode;
        if (
            this.isEditing &&
            parent &&
            isNodeOfType(parent, 'ELEMENT_NODE') &&
            isElementOfType(parent, 'span') &&
            parent.shadowRoot
        ) {
            format.isEditing = true;
        }
    };

    private editingFormatApplier: FormatApplier<EditableImageFormat> = (format, image, context) => {
        const parent = image.parentNode;
        if (
            this.editor &&
            format.isEditing &&
            isElementOfType(image, 'img') &&
            parent &&
            isNodeOfType(parent, 'ELEMENT_NODE') &&
            isElementOfType(parent, 'span') &&
            !parent.shadowRoot
        ) {
            if (this.isCropMode) {
                this.startCropMode(this.editor, image);
            } else {
                this.startRotateAndResize(this.editor, image);
            }
        }
    };

    //EXPOSED FOR TEST ONLY
    public get isEditingImage() {
        return this.isEditing;
    }
}
