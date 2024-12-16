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
import { normalizeImageSelection } from './utils/normalizeImageSelection';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';
import {
    ChangeSource,
    getSafeIdSelector,
    getSelectedParagraphs,
    isElementOfType,
    isNodeOfType,
    mutateBlock,
    mutateSegment,
    unwrap,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    ContentModelImage,
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    ImageMetadataFormat,
    KeyDownEvent,
    MouseDownEvent,
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
    onSelectState: ['resize', 'rotate'],
};

const MouseRightButton = 2;
const DRAG_ID = '_dragging';
const IMAGE_EDIT_CLASS = 'imageEdit';
const IMAGE_EDIT_CLASS_CARET = 'imageEditCaretColor';

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
    protected imageEditInfo: ImageMetadataFormat | null = null;
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
                    if (this.editor) {
                        this.applyFormatWithContentModel(
                            this.editor,
                            this.isCropMode,
                            true /* shouldSelectImage */
                        );
                    }
                },
            },
            dragstart: {
                beforeDispatch: ev => {
                    if (this.editor) {
                        const target = ev.target as Node;
                        if (this.isImageSelection(target)) {
                            target.id = target.id + DRAG_ID;
                        }
                    }
                },
            },
            dragend: {
                beforeDispatch: ev => {
                    if (this.editor) {
                        const target = ev.target as Node;
                        if (this.isImageSelection(target) && target.id.includes(DRAG_ID)) {
                            target.id = target.id.replace(DRAG_ID, '').trim();
                        }
                    }
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
            case 'mouseDown':
                this.mouseDownHandler(this.editor, event);
                break;
            case 'mouseUp':
                this.mouseUpHandler(this.editor, event);
                break;
            case 'keyDown':
                this.keyDownHandler(this.editor, event);
                break;
            case 'contentChanged':
                if (event.source == ChangeSource.Drop) {
                    this.onDropHandler(this.editor);
                }
                break;
            case 'extractContentWithDom':
                this.removeImageEditing(event.clonedRoot);
                break;
        }
    }

    private removeImageEditing(clonedRoot: HTMLElement) {
        const images = clonedRoot.querySelectorAll('img');
        images.forEach(image => {
            if (image.dataset.isEditing) {
                delete image.dataset.isEditing;
            }
            if (image.dataset.editingInfo) {
                delete image.dataset.editingInfo;
            }
        });
    }

    private isImageSelection(target: Node): target is HTMLElement {
        return (
            isNodeOfType(target, 'ELEMENT_NODE') &&
            (isElementOfType(target, 'img') ||
                !!(
                    isElementOfType(target, 'span') &&
                    target.firstElementChild &&
                    isNodeOfType(target.firstElementChild, 'ELEMENT_NODE') &&
                    isElementOfType(target.firstElementChild, 'img')
                ))
        );
    }

    private mouseUpHandler(editor: IEditor, event: MouseUpEvent) {
        const selection = editor.getDOMSelection();
        if ((selection && selection.type == 'image') || this.isEditing) {
            const shouldSelectImage =
                this.isImageSelection(event.rawEvent.target as Node) &&
                event.rawEvent.button === MouseRightButton;
            this.applyFormatWithContentModel(editor, this.isCropMode, shouldSelectImage);
        }
    }

    private mouseDownHandler(editor: IEditor, event: MouseDownEvent) {
        if (
            this.isEditing &&
            this.isImageSelection(event.rawEvent.target as Node) &&
            event.rawEvent.button !== MouseRightButton
        ) {
            this.applyFormatWithContentModel(
                editor,
                this.isCropMode,
                this.shadowSpan === event.rawEvent.target
            );
        }
    }

    private onDropHandler(editor: IEditor) {
        const selection = editor.getDOMSelection();
        if (selection?.type == 'image') {
            editor.formatContentModel(model => {
                const imageDragged = findEditingImage(model, selection.image.id);
                const imageDropped = findEditingImage(
                    model,
                    selection.image.id.replace(DRAG_ID, '').trim()
                );
                if (imageDragged && imageDropped) {
                    const draggedIndex = imageDragged.paragraph.segments.indexOf(
                        imageDragged.image
                    );
                    mutateBlock(imageDragged.paragraph).segments.splice(draggedIndex, 1);
                    const segment = imageDropped.image;
                    const paragraph = imageDropped.paragraph;
                    mutateSegment(paragraph, segment, image => {
                        image.isSelected = true;
                        image.isSelectedAsImageSelection = true;
                    });

                    return true;
                }
                return false;
            });
        }
    }

    private keyDownHandler(editor: IEditor, event: KeyDownEvent) {
        if (this.isEditing) {
            if (
                event.rawEvent.key === 'Escape' ||
                event.rawEvent.key === 'Delete' ||
                event.rawEvent.key === 'Backspace'
            ) {
                if (event.rawEvent.key === 'Escape') {
                    this.removeImageWrapper();
                }
                this.cleanInfo();
            } else {
                this.applyFormatWithContentModel(
                    editor,
                    this.isCropMode,
                    true /** should selectImage */,
                    false /* isApiOperation */
                );
            }
        }
    }

    /**
     * EXPOSED FOR TESTING PURPOSE ONLY
     */
    protected applyFormatWithContentModel(
        editor: IEditor,
        isCropMode: boolean,
        shouldSelectImage: boolean,
        isApiOperation?: boolean
    ) {
        let editingImageModel: ContentModelImage | undefined;
        const selection = editor.getDOMSelection();

        editor.formatContentModel(
            model => {
                const editingImage = getSelectedImage(model);
                const previousSelectedImage = isApiOperation
                    ? editingImage
                    : findEditingImage(model);
                let result = false;

                if (
                    shouldSelectImage ||
                    previousSelectedImage?.image != editingImage?.image ||
                    previousSelectedImage?.image.dataset.isEditing ||
                    isApiOperation
                ) {
                    const { lastSrc, selectedImage, imageEditInfo, clonedImage } = this;
                    if (
                        (this.isEditing || isApiOperation) &&
                        previousSelectedImage &&
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

                                image.isSelected = shouldSelectImage;
                                image.isSelectedAsImageSelection = shouldSelectImage;
                                delete image.dataset.isEditing;

                                if (selection?.type == 'range' && !selection.range.collapsed) {
                                    const selectedParagraphs = getSelectedParagraphs(model, true);
                                    const isImageInRange = selectedParagraphs.some(paragraph =>
                                        paragraph.segments.includes(image)
                                    );
                                    if (isImageInRange) {
                                        image.isSelected = true;
                                    }
                                }
                            }
                        );

                        if (shouldSelectImage) {
                            normalizeImageSelection(previousSelectedImage);
                        }

                        this.cleanInfo();
                        result = true;
                    }

                    this.isEditing = false;
                    this.isCropMode = false;

                    if (
                        editingImage &&
                        selection?.type == 'image' &&
                        !shouldSelectImage &&
                        !isApiOperation
                    ) {
                        this.isEditing = true;
                        this.isCropMode = isCropMode;
                        mutateSegment(editingImage.paragraph, editingImage.image, image => {
                            editingImageModel = image;
                            this.imageEditInfo = updateImageEditInfo(image, selection.image);
                            image.dataset.isEditing = 'true';
                        });

                        result = true;
                    }
                }

                return result;
            },
            {
                onNodeCreated: (model, node) => {
                    if (
                        !isApiOperation &&
                        editingImageModel &&
                        editingImageModel == model &&
                        editingImageModel.dataset.isEditing &&
                        isNodeOfType(node, 'ELEMENT_NODE') &&
                        isElementOfType(node, 'img')
                    ) {
                        if (isCropMode) {
                            this.startCropMode(editor, node);
                        } else {
                            this.startRotateAndResize(editor, node);
                        }
                    }
                },
            },
            {
                tryGetFromCache: true,
            }
        );
    }

    private startEditing(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation[]
    ) {
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
            this.options,
            this.imageEditInfo,
            this.imageHTMLOptions,
            apiOperation
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

        editor.setEditorStyle(IMAGE_EDIT_CLASS, `outline-style:none!important;`, [
            `span:has(>img${getSafeIdSelector(this.selectedImage.id)})`,
        ]);

        editor.setEditorStyle(IMAGE_EDIT_CLASS_CARET, `caret-color: transparent;`);
    }

    public startRotateAndResize(editor: IEditor, image: HTMLImageElement) {
        if (this.imageEditInfo) {
            this.startEditing(editor, image, ['resize', 'rotate']);
            if (this.selectedImage && this.imageEditInfo && this.wrapper && this.clonedImage) {
                const isMobileOrTable = !!editor.getEnvironment().isMobileOrTablet;
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
                        this.zoomScale,
                        isMobileOrTable
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
                                    this.wrapper
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
                        this.zoomScale,
                        isMobileOrTable
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
            this.startEditing(editor, image, ['crop']);
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
                        this.zoomScale,
                        !!editor.getEnvironment().isMobileOrTablet
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
        if (!this.editor.getEnvironment().isSafari) {
            this.editor.focus(); // Safari will keep the selection when click crop, then the focus() call should not be called
        }
        const selection = this.editor.getDOMSelection();
        if (selection?.type == 'image') {
            this.applyFormatWithContentModel(
                this.editor,
                true /* isCropMode */,
                false /* shouldSelectImage */
            );
        }
    }

    private editImage(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation[],
        operation: (imageEditInfo: ImageMetadataFormat) => void
    ) {
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

        this.applyFormatWithContentModel(
            editor,
            false /* isCrop */,
            true /* shouldSelect*/,
            true /* isApiOperation */
        );
    }

    /**
     * Exported for testing purpose only
     */
    public cleanInfo() {
        this.editor?.setEditorStyle(IMAGE_EDIT_CLASS, null);
        this.editor?.setEditorStyle(IMAGE_EDIT_CLASS_CARET, null);
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
            this.editImage(this.editor, image, ['flip'], imageEditInfo => {
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
            this.editImage(this.editor, image, [], imageEditInfo => {
                imageEditInfo.angleRad = (imageEditInfo.angleRad || 0) + angleRad;
            });
        }
    }
}
