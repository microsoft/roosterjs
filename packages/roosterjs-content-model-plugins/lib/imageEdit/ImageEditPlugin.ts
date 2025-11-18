import { applyChange } from './utils/applyChange';
import { canRegenerateImage } from './utils/canRegenerateImage';
import { checkIfImageWasResized, isASmallImage } from './utils/imageEditUtils';
import { createImageWrapper, IMAGE_EDIT_SHADOW_ROOT } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { EDITING_MARKER, findEditingImage } from './utils/findEditingImage';
import { filterInnerResizerHandles } from './utils/filterInnerResizerHandles';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getSelectedImage } from './utils/getSelectedImage';
import { getSelectedImageMetadata, updateImageEditInfo } from './utils/updateImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateHandleCursor } from './utils/updateHandleCursor';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';
//import { normalizeImageSelection } from './utils/normalizeImageSelection';
import {
    ChangeSource,
    getSafeIdSelector,
    //getSelectedParagraphs,
    isElementOfType,
    isEntityElement,
    isNodeOfType,
    mutateBlock,
    mutateSegment,
    setImageState,
    unwrap,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    ContentChangedEvent,
    ContentModelImage,
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    ImageMetadataFormat,
    KeyDownEvent,
    MouseDownEvent,
    // MouseDownEvent,
    // MouseUpEvent,
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
    onSelectState: ['resize', 'rotate'],
};

//const MouseRightButton = 2;
const DRAG_ID = '_dragging';
const IMAGE_EDIT_CLASS = 'imageEdit';
const IMAGE_EDIT_CLASS_CARET = 'imageEditCaretColor';
const IMAGE_EDIT_FORMAT_EVENT = 'ImageEditEvent';

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
    protected options: ImageEditOptions;

    constructor(options?: ImageEditOptions) {
        this.options = { ...DefaultOptions, ...options };
    }

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
            blur: {
                beforeDispatch: ev => {
                    if (this.editor && this.selectedImage) {
                        this.applyFormatWithContentModel(this.editor, this.isCropMode);
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
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
        this.cleanInfo();
        this.editor = null;
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
                this.selectionChangeHandler(this.editor, event);
                break;
            case 'keyDown':
                this.keyDownHandler(this.editor, event);
                break;
            case 'mouseDown':
                this.mouseDownHandler(this.editor, event);
                break;
            case 'contentChanged':
                this.contentChangedHandler(this.editor, event);
                break;
            case 'extractContentWithDom':
                this.removeImageEditing(event.clonedRoot);
                break;
            case 'beforeLogicalRootChange':
                this.handleBeforeLogicalRootChange();
                break;
        }
    }

    private handleBeforeLogicalRootChange() {
        if (this.selectedImage && this.editor && !this.editor.isDisposed()) {
            this.applyFormatWithContentModel(this.editor, this.isCropMode);
        }
    }

    private removeImageEditing(clonedRoot: HTMLElement) {
        const images = clonedRoot.querySelectorAll('img');
        images.forEach(image => {
            if (image.dataset.editingInfo) {
                delete image.dataset.editingInfo;
            }
        });
    }

    private mouseDownHandler(editor: IEditor, event: MouseDownEvent) {
        const selection = editor.getDOMSelection();
        const target = event.rawEvent.target as Element;
        const isEditingImage =
            target.firstElementChild?.id == IMAGE_EDIT_SHADOW_ROOT && target.childElementCount == 1;
        if (selection?.type == 'image' && (isEditingImage || isEntityElement(target))) {
            const range = editor.getDocument().createRange();
            const image = this.removeImageWrapper();
            if (image) {
                range.selectNode(image);
                range.collapse();
                editor.setDOMSelection({
                    type: 'range',
                    range,
                    isReverted: false,
                });
            }
        }
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

    private selectionChangeHandler(editor: IEditor, event: SelectionChangedEvent) {
        if ((event.newSelection && event.newSelection.type == 'image') || this.selectedImage) {
            this.applyFormatWithContentModel(editor, this.isCropMode);
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
        if (this.selectedImage) {
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
                if (event.rawEvent.key == 'Enter' && this.isCropMode) {
                    event.rawEvent.preventDefault();
                }
                this.applyFormatWithContentModel(
                    editor,
                    this.isCropMode,
                    false /* isApiOperation */
                );
            }
        }
    }

    private setContentHandler(editor: IEditor) {
        const selection = editor.getDOMSelection();
        if (selection?.type == 'image') {
            this.cleanInfo();
            setImageState(selection.image, '');
        }
    }

    private formatEventHandler(event: ContentChangedEvent) {
        if (this.selectedImage && event.formatApiName !== IMAGE_EDIT_FORMAT_EVENT) {
            this.cleanInfo();
        }
    }

    private contentChangedHandler(editor: IEditor, event: ContentChangedEvent) {
        switch (event.source) {
            case ChangeSource.SetContent:
                this.setContentHandler(editor);
                break;
            case ChangeSource.Format:
                this.formatEventHandler(event);
                break;
            case ChangeSource.Drop:
                this.onDropHandler(editor);
                break;
        }
    }

    /**
     * EXPOSED FOR TESTING PURPOSE ONLY
     */
    protected applyFormatWithContentModel(
        editor: IEditor,
        isCropMode: boolean,
        isApiOperation?: boolean
    ) {
        let editingImageModel: ContentModelImage | undefined;
        const selection = editor.getDOMSelection();
        let isRTL: boolean = false;
        editor.getDocument().defaultView?.requestAnimationFrame(() => {
            editor.formatContentModel(
                (model, context) => {
                    const editingImage = getSelectedImage(model);
                    const previousSelectedImage = isApiOperation
                        ? editingImage
                        : findEditingImage(model, undefined);
                    let result = false;

                    // Skip adding undo snapshot for now. If we detect any changes later, we will reset it
                    context.skipUndoSnapshot = 'SkipAll';

                    const clickInDifferentImage =
                        previousSelectedImage?.image != editingImage?.image;

                    if (
                        clickInDifferentImage ||
                        previousSelectedImage?.image.format.imageState == EDITING_MARKER ||
                        isApiOperation
                    ) {
                        const { lastSrc, selectedImage, imageEditInfo, clonedImage } = this;
                        if (
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
                                    const changeState = applyChange(
                                        editor,
                                        selectedImage,
                                        image,
                                        imageEditInfo,
                                        lastSrc,
                                        this.wasImageResized || this.isCropMode,
                                        clonedImage
                                    );

                                    if (this.wasImageResized || changeState == 'FullyChanged') {
                                        context.skipUndoSnapshot = false;
                                    }
                                    image.format.imageState = undefined;
                                }
                            );

                            this.cleanInfo();
                            result = true;
                        }

                        if (
                            clickInDifferentImage &&
                            editingImage &&
                            selection?.type == 'image' &&
                            !isApiOperation
                        ) {
                            this.isCropMode = isCropMode;
                            mutateSegment(editingImage.paragraph, editingImage.image, image => {
                                editingImageModel = image;
                                isRTL = editingImage.paragraph.format.direction == 'rtl';
                                this.imageEditInfo = updateImageEditInfo(image, selection.image);
                                image.format.imageState = EDITING_MARKER;
                            });

                            result = true;
                        }
                    }

                    return result;
                },
                {
                    skipSelectionChangedEvent: true,
                    onNodeCreated: (model, node) => {
                        if (
                            !isApiOperation &&
                            editingImageModel &&
                            editingImageModel == model &&
                            editingImageModel.format.imageState == EDITING_MARKER &&
                            isNodeOfType(node, 'ELEMENT_NODE') &&
                            isElementOfType(node, 'img')
                        ) {
                            if (isCropMode) {
                                this.startCropMode(editor, node, isRTL);
                            } else {
                                this.startRotateAndResize(editor, node, isRTL);
                            }
                        }
                    },
                    apiName: IMAGE_EDIT_FORMAT_EVENT,
                },
                {
                    tryGetFromCache: true,
                }
            );
        });
    }

    private startEditing(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation[]
    ) {
        if (!this.imageEditInfo) {
            this.imageEditInfo = getSelectedImageMetadata(editor, image);
        }

        if (
            (this.imageEditInfo.widthPx == 0 || this.imageEditInfo.heightPx == 0) &&
            !image.complete
        ) {
            // Image dimensions are zero and loading is incomplete, wait for image to load.
            image.onload = () => {
                this.updateImageDimensionsIfZero(image);
                this.startEditingInternal(editor, image, apiOperation);
                image.onload = null;
                image.onerror = null;
            };
            image.onerror = () => {
                image.onload = null;
                image.onerror = null;
            };
        } else {
            this.updateImageDimensionsIfZero(image);
            this.startEditingInternal(editor, image, apiOperation);
        }
    }

    private updateImageDimensionsIfZero(image: HTMLImageElement) {
        if (this.imageEditInfo?.widthPx === 0 || this.imageEditInfo?.heightPx === 0) {
            this.imageEditInfo.widthPx = image.clientWidth;
            this.imageEditInfo.heightPx = image.clientHeight;
        }
    }

    private startEditingInternal(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation: ImageEditOperation[]
    ) {
        if (!this.imageEditInfo) {
            this.imageEditInfo = getSelectedImageMetadata(editor, image);
        }

        this.imageHTMLOptions = getHTMLImageOptions(editor, this.options, this.imageEditInfo);
        this.lastSrc = image.getAttribute('src');

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

    public startRotateAndResize(editor: IEditor, image: HTMLImageElement, isRTL: boolean) {
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
                                    this.resizers,
                                    undefined /* croppers */,
                                    isRTL
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
                                    this.wrapper,
                                    undefined /* resizers */,
                                    undefined /* croppers */,
                                    isRTL,
                                    true /* isRotating */
                                );
                                this.updateRotateHandleState(
                                    editor,
                                    this.selectedImage,
                                    this.wrapper,
                                    this.rotators,
                                    this.imageEditInfo?.angleRad,
                                    !!this.options?.disableSideResize
                                );
                                this.updateResizeHandleDirection(
                                    this.resizers,
                                    this.imageEditInfo.angleRad
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
                    this.resizers,
                    undefined /* croppers */,
                    isRTL
                );

                this.updateRotateHandleState(
                    editor,
                    this.selectedImage,
                    this.wrapper,
                    this.rotators,
                    this.imageEditInfo?.angleRad,
                    !!this.options?.disableSideResize
                );
            }
        }
    }

    private updateResizeHandleDirection(resizers: HTMLDivElement[], angleRad: number | undefined) {
        const resizeHandles = filterInnerResizerHandles(resizers);
        if (angleRad !== undefined) {
            updateHandleCursor(resizeHandles, angleRad);
        }
    }

    private updateRotateHandleState(
        editor: IEditor,
        image: HTMLImageElement,
        wrapper: HTMLSpanElement,
        rotators: HTMLDivElement[],
        angleRad: number | undefined,
        disableSideResize: boolean
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
                    smallImage,
                    disableSideResize
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

    private startCropMode(editor: IEditor, image: HTMLImageElement, isRTL: boolean) {
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
                                    undefined /* resizers */,
                                    this.croppers,
                                    isRTL
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
                    undefined /* resizers */,
                    this.croppers,
                    isRTL
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

        this.applyFormatWithContentModel(editor, false /* isCrop */, true /* isApiOperation */);
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
                const isInVerticalPosition =
                    (angleRad >= Math.PI / 2 && angleRad < (3 * Math.PI) / 4) ||
                    (angleRad <= -Math.PI / 2 && angleRad > (-3 * Math.PI) / 4);
                if (isInVerticalPosition) {
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
