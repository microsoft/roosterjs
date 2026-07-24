import { applyChange } from './utils/applyChange';
import { canRegenerateImage } from './utils/canRegenerateImage';
import { checkIfImageWasResized, isASmallImage } from './utils/imageEditUtils';
import { createImageWrapper } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { filterInnerResizerHandles } from './utils/filterInnerResizerHandles';
import { findEditingImage } from './utils/findEditingImage';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getSelectedImageMetadata } from './utils/updateImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { normalizeImageSelection } from './utils/normalizeImageSelection';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateHandleCursor } from './utils/updateHandleCursor';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';
import {
    getSafeIdSelector,
    isElementOfType,
    isNodeOfType,
    mutateSegment,
    unwrap,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type { WrapperElements } from './utils/createImageWrapper';
import type {
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    ImageMetadataFormat,
    KeyDownEvent,
    MouseUpEvent,
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

const MouseRightButton = 2;
const IMAGE_EDIT_CLASS = 'imageEdit';
const IMAGE_EDIT_CLASS_CARET = 'imageEditCaretColor';
const IMAGE_EDIT_FORMAT_EVENT = 'ImageEditEvent';

/**
 * @internal
 * Per-image state that lives as long as the image is wrapped. It holds the elements produced by
 * `createImageWrapper` together with the edit info used to position/apply changes.
 */
interface ImageWrapperContext extends WrapperElements {
    editInfo: ImageMetadataFormat;
    lastSrc: string | null;
    isRTL: boolean;
    dndHelpers: DragAndDropHelper<DragAndDropContext, any>[];
    isCropMode: boolean;
    wasImageResized: boolean;
}

/**
 * ImageEditPluginV2 handles the same image editing features as the legacy ImageEdit plugin:
 * - Resize image
 * - Crop image
 * - Rotate image
 * - Flip image
 *
 * Unlike the legacy plugin, which creates the edit wrapper only for the selected image and tears it
 * down on every selection change, this plugin renders the edit wrapper for every image up-front and
 * keeps it in place. The wrapper decorations (border and resize/rotate/crop handles) stay hidden
 * (via the `HideHandles` CSS class) until the image is selected, and are hidden again once the image
 * is unselected.
 *
 * This plugin is used when the `ImageEditV2` experimental feature is enabled. When the feature is
 * disabled, the `LegacyImageEditPlugin` is used instead.
 *
 * It reuses the low-level image edit utilities (createImageWrapper, updateWrapper,
 * getDropAndDragHelpers, applyChange, ...) rather than the legacy plugin itself.
 */
export class ImageEditPluginV2 implements ImageEditor, EditorPlugin {
    public editor: IEditor | null = null;
    public isEditing = false;
    protected options: ImageEditOptions;

    private disposer: (() => void) | null = null;

    // Maps an original (light DOM) image element to the context of its edit wrapper.
    private contexts: WeakMap<HTMLImageElement, ImageWrapperContext> = new WeakMap();

    // The image that is currently selected/being edited, if any.
    private activeImage: HTMLImageElement | null = null;

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
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = editor.attachDomEvent({
            blur: {
                beforeDispatch: () => {
                    if (this.editor && !this.editor.isDisposed()) {
                        this.deactivateImage(true /* shouldSelectImage */);
                    }
                },
            },
        });
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     */
    dispose() {
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
        this.isEditing = false;
        this.removeAllWrappers();
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
            case 'editorReady':
                this.renderAllWrappers(this.editor);
                break;
            case 'contentChanged':
                if (event.source != IMAGE_EDIT_FORMAT_EVENT) {
                    this.deactivateImage(false /* shouldSelectImage */);
                    this.renderAllWrappers(this.editor);
                }
                break;
            case 'selectionChanged':
                this.selectionChangedHandler(this.editor, event);
                break;
            case 'mouseUp':
                this.mouseUpHandler(this.editor, event);
                break;
            case 'keyDown':
                this.keyDownHandler(this.editor, event);
                break;
            case 'extractContentWithDom':
                this.removeImageEditing(event.clonedRoot);
                break;
            case 'beforeLogicalRootChange':
                this.deactivateImage(false /* shouldSelectImage */);
                break;
        }
    }

    //#region Public ImageEditor API

    public isOperationAllowed(operation: ImageEditOperation): boolean {
        return (
            operation === 'resize' ||
            operation === 'rotate' ||
            operation === 'flip' ||
            operation === 'crop'
        );
    }

    public canRegenerateImage(image: HTMLImageElement): boolean {
        return canRegenerateImage(image, this.options.resolveImageSource);
    }

    public cropImage() {
        const editor = this.editor;
        if (!editor) {
            return;
        }
        if (!editor.getEnvironment().isSafari) {
            editor.focus(); // Safari will keep the selection when click crop, then the focus() call should not be called
        }
        const selection = editor.getDOMSelection();
        if (selection?.type == 'image') {
            const image = this.getSelectedImageElement(selection.image);
            if (image) {
                this.startCropMode(editor, image);
            }
        }
    }

    public flipImage(direction: 'horizontal' | 'vertical') {
        this.editSelectedImage(imageEditInfo => {
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

    public rotateImage(angleRad: number) {
        this.editSelectedImage(imageEditInfo => {
            imageEditInfo.angleRad = (imageEditInfo.angleRad || 0) + angleRad;
        });
    }

    /**
     * Write the pending edit of the currently active image back to the content model.
     * Exposed for testing purpose only.
     */
    public applyFormatWithContentModel(
        editor: IEditor,
        isCropMode: boolean,
        shouldSelectImage?: boolean,
        _isApiOperation?: boolean
    ) {
        const image = this.activeImage;
        const context = image ? this.contexts.get(image) : undefined;

        if (!image || !context || context.lastSrc == null) {
            return;
        }

        const { editInfo, lastSrc, imageClone } = context;
        const wasResizedOrCropped = context.wasImageResized || isCropMode;

        editor.formatContentModel(
            (model, formatContext) => {
                formatContext.skipUndoSnapshot = 'SkipAll';

                const editingImage = findEditingImage(model, image.id);

                if (!editingImage) {
                    return false;
                }

                let changed = false;

                mutateSegment(editingImage.paragraph, editingImage.image, modelImage => {
                    const changeState = applyChange(
                        editor,
                        image,
                        modelImage,
                        editInfo,
                        lastSrc,
                        wasResizedOrCropped,
                        imageClone
                    );

                    if (context.wasImageResized || changeState == 'FullyChanged') {
                        formatContext.skipUndoSnapshot = false;
                        changed = true;
                    }

                    modelImage.isSelected = !!shouldSelectImage;
                    modelImage.isSelectedAsImageSelection = !!shouldSelectImage;
                    modelImage.format.imageState = undefined;
                });

                if (shouldSelectImage) {
                    normalizeImageSelection(editingImage);
                }

                return changed;
            },
            {
                apiName: IMAGE_EDIT_FORMAT_EVENT,
            },
            {
                tryGetFromCache: true,
            }
        );
    }

    //#endregion

    //#region Wrapper rendering

    /**
     * Ensure every image in the editor content has a (hidden) edit wrapper.
     */
    private renderAllWrappers(editor: IEditor) {
        const images = editor.getDOMHelper().queryElements('img');

        images.forEach(image => {
            if (!this.isImageWrapped(image) && !this.contexts.has(image)) {
                this.renderWrapper(editor, image, ['resize', 'rotate']);
            }
        });
    }

    /**
     * Render a hidden edit wrapper for a single image.
     */
    private renderWrapper(
        editor: IEditor,
        image: HTMLImageElement,
        operations: ImageEditOperation[]
    ): ImageWrapperContext | null {
        const editInfo = getSelectedImageMetadata(editor, image);

        if (editInfo.widthPx === 0 || editInfo.heightPx === 0) {
            editInfo.widthPx = image.clientWidth;
            editInfo.heightPx = image.clientHeight;
        }

        const htmlOptions: ImageHtmlOptions = getHTMLImageOptions(editor, this.options, editInfo);
        const lastSrc = image.getAttribute('src');
        const isRTL = editor.getDocument().defaultView?.getComputedStyle(image).direction == 'rtl';

        const wrapperElements = createImageWrapper(
            editor,
            image,
            this.options,
            editInfo,
            htmlOptions,
            operations
        );

        // Keep the wrapper decorations hidden until the image is selected.
        wrapperElements.wrapper.classList.add(ImageEditElementClass.HideHandles);

        const context: ImageWrapperContext = {
            ...wrapperElements,
            editInfo,
            lastSrc,
            isRTL: !!isRTL,
            dndHelpers: [],
            isCropMode: operations.indexOf('crop') > -1,
            wasImageResized: checkIfImageWasResized(image),
        };

        this.contexts.set(image, context);

        updateWrapper(
            editInfo,
            this.options,
            image,
            wrapperElements.imageClone,
            wrapperElements.wrapper,
            context.isCropMode ? undefined : wrapperElements.resizers,
            context.isCropMode ? wrapperElements.croppers : undefined,
            context.isRTL
        );

        return context;
    }

    /**
     * Remove the edit wrapper of a single image, unwrapping the original image back into the DOM.
     */
    private removeWrapper(image: HTMLImageElement) {
        const context = this.contexts.get(image);

        if (context) {
            context.dndHelpers.forEach(helper => helper.dispose());
            const shadowSpan = context.shadowSpan;

            if (shadowSpan && shadowSpan.parentElement) {
                unwrap(shadowSpan);
            }

            this.contexts.delete(image);
        }
    }

    private removeAllWrappers() {
        const editor = this.editor;

        if (editor) {
            editor
                .getDOMHelper()
                .queryElements('img')
                .forEach(image => this.removeWrapper(image));

            editor.setEditorStyle(IMAGE_EDIT_CLASS, null);
            editor.setEditorStyle(IMAGE_EDIT_CLASS_CARET, null);
        }

        this.activeImage = null;
        this.isEditing = false;
    }

    //#endregion

    //#region Selection handling

    private selectionChangedHandler(editor: IEditor, event: SelectionChangedEvent) {
        const selection = event.newSelection;
        const selectedImage =
            selection?.type == 'image' ? this.getSelectedImageElement(selection.image) : null;

        if (selectedImage != this.activeImage) {
            this.deactivateImage(false /* shouldSelectImage */);

            if (selectedImage) {
                this.activateImage(editor, selectedImage);
            }
        }
    }

    private mouseUpHandler(editor: IEditor, event: MouseUpEvent) {
        // Right clicking an image should keep it as a regular image selection (e.g. for context
        // menu), so exit edit mode and reselect the image.
        if (
            this.activeImage &&
            this.isImageSelection(event.rawEvent.target as Node) &&
            event.rawEvent.button === MouseRightButton
        ) {
            this.deactivateImage(true /* shouldSelectImage */);
        }
    }

    private keyDownHandler(editor: IEditor, event: KeyDownEvent) {
        if (!this.activeImage) {
            return;
        }

        const key = event.rawEvent.key;
        const context = this.contexts.get(this.activeImage);

        if (key === 'Escape') {
            // Discard the pending edit and just hide the handles again.
            this.hideHandles(this.activeImage);
            this.disposeHelpers(this.activeImage);
            this.activeImage = null;
            this.isEditing = false;
        } else if (key === 'Delete' || key === 'Backspace') {
            this.activeImage = null;
            this.isEditing = false;
        } else {
            if (key === 'Enter' && context?.isCropMode) {
                event.rawEvent.preventDefault();
            }
            this.deactivateImage(true /* shouldSelectImage */);
        }
    }

    /**
     * Reveal the edit wrapper of the given image and wire up the drag-and-drop handles so it can be
     * resized/rotated.
     */
    private activateImage(editor: IEditor, image: HTMLImageElement) {
        let context = this.contexts.get(image);

        if (!context && !this.isImageWrapped(image)) {
            context = this.renderWrapper(editor, image, ['resize', 'rotate']) ?? undefined;
        }

        if (!context) {
            return;
        }

        this.activeImage = image;
        this.isEditing = true;

        this.showHandles(image);
        this.setupResizeAndRotate(editor, image, context);

        editor.setEditorStyle(IMAGE_EDIT_CLASS, `outline-style:none!important;`, [
            `span:has(>img${getSafeIdSelector(image.id)})`,
        ]);
        editor.setEditorStyle(IMAGE_EDIT_CLASS_CARET, `caret-color: transparent;`);
    }

    /**
     * Apply the pending edit for the active image (if any), hide its handles and clear active state.
     */
    private deactivateImage(shouldSelectImage: boolean) {
        const editor = this.editor;
        const image = this.activeImage;

        if (!editor || !image) {
            return;
        }

        const context = this.contexts.get(image);

        this.applyFormatWithContentModel(editor, !!context?.isCropMode, shouldSelectImage);

        this.disposeHelpers(image);
        this.hideHandles(image);

        // A crop wrapper only has crop handles, switch it back to resize/rotate for next time.
        if (context?.isCropMode) {
            this.removeWrapper(image);
            this.renderWrapper(editor, image, ['resize', 'rotate']);
        }

        editor.setEditorStyle(IMAGE_EDIT_CLASS, null);
        editor.setEditorStyle(IMAGE_EDIT_CLASS_CARET, null);

        this.activeImage = null;
        this.isEditing = false;
    }

    //#endregion

    //#region Editing helpers

    private setupResizeAndRotate(
        editor: IEditor,
        image: HTMLImageElement,
        context: ImageWrapperContext
    ) {
        const { editInfo, imageClone, wrapper, resizers, rotators } = context;
        const isRTL = context.isRTL;
        const zoomScale = editor.getDOMHelper().calculateZoomScale();
        const isMobileOrTablet = !!editor.getEnvironment().isMobileOrTablet;

        context.dndHelpers = [
            ...getDropAndDragHelpers(
                wrapper,
                editInfo,
                this.options,
                ImageEditElementClass.ResizeHandle,
                Resizer,
                () => {
                    updateWrapper(
                        editInfo,
                        this.options,
                        image,
                        imageClone,
                        wrapper,
                        resizers,
                        undefined /* croppers */,
                        isRTL
                    );
                    context.wasImageResized = true;
                },
                zoomScale,
                isMobileOrTablet
            ),
            ...getDropAndDragHelpers(
                wrapper,
                editInfo,
                this.options,
                ImageEditElementClass.RotateHandle,
                Rotator,
                () => {
                    updateWrapper(
                        editInfo,
                        this.options,
                        image,
                        imageClone,
                        wrapper,
                        undefined /* resizers */,
                        undefined /* croppers */,
                        isRTL,
                        true /* isRotating */
                    );
                    this.updateRotateHandleState(
                        editor,
                        image,
                        wrapper,
                        rotators,
                        editInfo.angleRad,
                        !!this.options.disableSideResize
                    );
                    this.updateResizeHandleDirection(resizers, editInfo.angleRad);
                },
                zoomScale,
                isMobileOrTablet
            ),
        ];

        updateWrapper(
            editInfo,
            this.options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined /* croppers */,
            isRTL
        );

        this.updateRotateHandleState(
            editor,
            image,
            wrapper,
            rotators,
            editInfo.angleRad,
            !!this.options.disableSideResize
        );
    }

    private startCropMode(editor: IEditor, image: HTMLImageElement) {
        // Exit any current edit first (this also applies pending changes).
        this.deactivateImage(false /* shouldSelectImage */);

        // Rebuild the wrapper with crop handles.
        this.removeWrapper(image);
        const context = this.renderWrapper(editor, image, ['crop']);

        if (!context) {
            return;
        }

        this.activeImage = image;
        this.isEditing = true;
        this.showHandles(image);

        const { editInfo, imageClone, wrapper, croppers } = context;
        const isRTL = context.isRTL;
        const zoomScale = editor.getDOMHelper().calculateZoomScale();

        context.dndHelpers = getDropAndDragHelpers(
            wrapper,
            editInfo,
            this.options,
            ImageEditElementClass.CropHandle,
            Cropper,
            () => {
                updateWrapper(
                    editInfo,
                    this.options,
                    image,
                    imageClone,
                    wrapper,
                    undefined /* resizers */,
                    croppers,
                    isRTL
                );
                context.isCropMode = true;
            },
            zoomScale,
            !!editor.getEnvironment().isMobileOrTablet
        );

        updateWrapper(
            editInfo,
            this.options,
            image,
            imageClone,
            wrapper,
            undefined /* resizers */,
            croppers,
            isRTL
        );

        editor.setEditorStyle(IMAGE_EDIT_CLASS, `outline-style:none!important;`, [
            `span:has(>img${getSafeIdSelector(image.id)})`,
        ]);
        editor.setEditorStyle(IMAGE_EDIT_CLASS_CARET, `caret-color: transparent;`);
    }

    private editSelectedImage(operation: (imageEditInfo: ImageMetadataFormat) => void) {
        const editor = this.editor;
        const selection = editor?.getDOMSelection();

        if (!editor || !selection || selection.type !== 'image') {
            return;
        }

        const image = this.getSelectedImageElement(selection.image);

        if (!image) {
            return;
        }

        let context = this.contexts.get(image);

        if (!context) {
            context = this.renderWrapper(editor, image, ['resize', 'rotate']) ?? undefined;
        }

        if (!context) {
            return;
        }

        this.activeImage = image;
        operation(context.editInfo);

        updateWrapper(context.editInfo, this.options, image, context.imageClone, context.wrapper);

        this.applyFormatWithContentModel(
            editor,
            false /* isCropMode */,
            true /* shouldSelectImage */,
            true /* isApiOperation */
        );

        this.activeImage = null;
        this.isEditing = false;
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

    private disposeHelpers(image: HTMLImageElement) {
        const context = this.contexts.get(image);
        if (context) {
            context.dndHelpers.forEach(helper => helper.dispose());
            context.dndHelpers = [];
        }
    }

    //#endregion

    //#region Show/hide handles

    /**
     * Reveal the edit wrapper decorations (border and handles) for the given image.
     * Exposed for testing purpose only.
     */
    public showHandles(image: HTMLImageElement) {
        this.toggleHandles(image, true /* show */);
    }

    /**
     * Hide the edit wrapper decorations (border and handles) while keeping the image visible.
     * Exposed for testing purpose only.
     */
    public hideHandles(image: HTMLImageElement) {
        this.toggleHandles(image, false /* show */);
    }

    private toggleHandles(image: HTMLImageElement, show: boolean) {
        const wrapper = this.contexts.get(image)?.wrapper;

        if (wrapper) {
            if (show) {
                wrapper.classList.remove(ImageEditElementClass.HideHandles);
            } else {
                wrapper.classList.add(ImageEditElementClass.HideHandles);
            }
        }
    }

    //#endregion

    //#region Utilities

    /**
     * The DOM selection's image may be reported as a different node than the one we track. Resolve
     * it back to the original (light DOM) image element that has a wrapper context.
     */
    private getSelectedImageElement(image: HTMLImageElement): HTMLImageElement | null {
        if (this.contexts.has(image)) {
            return image;
        }

        const editor = this.editor;

        if (editor && image.id) {
            const match = editor
                .getDOMHelper()
                .queryElements('img')
                .find(img => img.id == image.id && this.contexts.has(img));

            if (match) {
                return match;
            }
        }

        return image;
    }

    private isImageWrapped(image: HTMLImageElement): boolean {
        const parent = image.parentElement;
        return (
            !!parent &&
            isElementOfType(parent, 'span') &&
            !!parent.shadowRoot &&
            parent.contains(image)
        );
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

    private removeImageEditing(clonedRoot: HTMLElement) {
        const images = clonedRoot.querySelectorAll('img');
        images.forEach(image => {
            if (image.dataset.editingInfo) {
                delete image.dataset.editingInfo;
            }
        });
    }

    //#endregion
}
