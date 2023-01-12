import applyChange from './editInfoUtils/applyChange';
import canRegenerateImage from './api/canRegenerateImage';
import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from './types/DragAndDropContext';
import DragAndDropHandler from '../../pluginUtils/DragAndDropHandler';
import DragAndDropHelper from '../../pluginUtils/DragAndDropHelper';
import getGeneratedImageSize from './editInfoUtils/getGeneratedImageSize';
import getLatestZIndex from './editInfoUtils/getLastZIndex';
import ImageEditInfo from './types/ImageEditInfo';
import ImageHtmlOptions from './types/ImageHtmlOptions';
import { Cropper, getCropHTML } from './imageEditors/Cropper';
import { deleteEditInfo, getEditInfoFromImage } from './editInfoUtils/editInfo';
import { getRotateHTML, Rotator } from './imageEditors/Rotator';
import { ImageEditElementClass } from './types/ImageEditElementClass';

import {
    arrayPush,
    Browser,
    createElement,
    getComputedStyle,
    getObjectKeys,
    removeGlobalCssStyle,
    safeInstanceOf,
    setGlobalCssStyles,
    toArray,
} from 'roosterjs-editor-dom';
import {
    Resizer,
    doubleCheckResize,
    getSideResizeHTML,
    getCornerResizeHTML,
    OnShowResizeHandle,
    getResizeBordersHTML,
} from './imageEditors/Resizer';
import {
    ImageEditOperation,
    ImageEditOptions,
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    CreateElementData,
    KnownCreateElementDataIndex,
    ModeIndependentColor,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import type { CompatibleImageEditOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

const PI = Math.PI;
const DIRECTIONS = 8;
const DirectionRad = (PI * 2) / DIRECTIONS;
const DirectionOrder = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

/**
 * Default image edit options
 */
const DefaultOptions: Required<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
    preserveRatio: false,
    minRotateDeg: 5,
    imageSelector: 'img',
    rotateIconHTML: null,
    disableCrop: false,
    disableRotate: false,
    disableSideResize: false,
    onSelectState: ImageEditOperation.ResizeAndRotate,
};

/**
 * Map the image edit operation to a function that returns editing elements HTML to help
 * build image editing UI
 */
const ImageEditHTMLMap = {
    [ImageEditOperation.CornerResize]: getCornerResizeHTML,
    [ImageEditOperation.SideResize]: getSideResizeHTML,
    [ImageEditOperation.Rotate]: getRotateHTML,
    [ImageEditOperation.Crop]: getCropHTML,
};

/**
 * Default background colors for rotate handle
 */
const LIGHT_MODE_BGCOLOR = 'white';
const DARK_MODE_BGCOLOR = '#333';

/**
 * The biggest area of image with 4 handles
 */
const MAX_SMALL_SIZE_IMAGE = 10000;

/**
 * ImageEdit plugin provides the ability to edit an inline image in editor, including image resizing, rotation and cropping
 */
export default class ImageEdit implements EditorPlugin {
    protected editor: IEditor;
    protected options: ImageEditOptions;
    private disposer: () => void;

    // Allowed editing operations
    private allowedOperations: ImageEditOperation;

    // Current editing image
    private image: HTMLImageElement;

    // Image cloned from the current editing image
    private clonedImage: HTMLImageElement;

    // The image wrapper
    private wrapper: HTMLSpanElement;

    // Current edit info of the image. All changes user made will be stored in this object.
    // We use this object to update the editing UI, and finally we will use this object to generate
    // the new image if necessary
    private editInfo: ImageEditInfo;

    // Src of the image before current editing
    private lastSrc: string;

    // Drag and drop helper objects
    private dndHelpers: DragAndDropHelper<DragAndDropContext, any>[];

    /**
     * Identify if the image was resized by the user.
     */
    private wasResized: boolean;

    /**
     * Editor zoom scale
     */
    private zoomWrapper: HTMLElement;

    /**
     * Create a new instance of ImageEdit
     * @param options Image editing options
     * @param onShowResizeHandle An optional callback to allow customize resize handle element of image resizing.
     * To customize the resize handle element, add this callback and change the attributes of elementData then it
     * will be picked up by ImageEdit code
     */
    constructor(options?: ImageEditOptions, private onShowResizeHandle?: OnShowResizeHandle) {
        this.options = {
            ...DefaultOptions,
            ...(options || {}),
        };

        this.allowedOperations =
            ImageEditOperation.CornerResize |
            (this.options.disableCrop ? 0 : ImageEditOperation.Crop) |
            (this.options.disableRotate ? 0 : ImageEditOperation.Rotate) |
            (this.options.disableSideResize ? 0 : ImageEditOperation.SideResize);
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'ImageEdit';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = editor.addDomEventHandler('blur', this.onBlur);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.clearDndHelpers();
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param e PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.SelectionChanged:
                if (
                    e.selectionRangeEx &&
                    e.selectionRangeEx.type === SelectionRangeTypes.ImageSelection
                ) {
                    this.setEditingImage(e.selectionRangeEx.image, this.options.onSelectState);
                }
                break;
            case PluginEventType.MouseDown:
                this.setEditingImage(null);
                break;
            case PluginEventType.KeyDown:
                this.setEditingImage(null);
                break;
            case PluginEventType.ContentChanged:
                if (e.source !== ChangeSource.Format) {
                    // After contentChanged event, the current image wrapper may not be valid any more, remove all of them if any
                    this.removeWrapper();
                }
                break;

            case PluginEventType.ExtractContentWithDom:
                // When extract content, remove all image info since they may not be valid when load the content again
                toArray(e.clonedRoot.querySelectorAll(this.options.imageSelector)).forEach(img => {
                    deleteEditInfo(img as HTMLImageElement);
                });
                break;

            case PluginEventType.Scroll:
                this.setEditingImage(null);
                break;
        }
    }

    /**
     * Check if the given image edit operation is allowed by this plugin
     * @param operation The image edit operation to check
     * @returns True means it is allowed, otherwise false
     */
    isOperationAllowed(operation: ImageEditOperation): boolean {
        return !!(this.allowedOperations & operation);
    }

    /**
     * Set current image for edit. If there is already image in editing, it will quit editing mode and any pending editing
     * operation will be submitted
     * @param image The image to edit
     * @param operation The editing operation
     */
    setEditingImage(
        image: HTMLImageElement,
        operation: ImageEditOperation | CompatibleImageEditOperation
    ): void;

    /**
     * Stop editing image. If there is already image in editing, it will quit editing mode and any pending editing
     * operation will be submitted
     * @param image The image to edit
     * @param selectImage True to select this image after quit editing mode
     */
    setEditingImage(image: null, selectImage?: boolean): void;

    setEditingImage(
        image: HTMLImageElement | null,
        operationOrSelect?: ImageEditOperation | CompatibleImageEditOperation | boolean
    ) {
        let operation =
            typeof operationOrSelect === 'number' ? operationOrSelect : ImageEditOperation.None;
        const selectImage = typeof operationOrSelect === 'number' ? false : !!operationOrSelect;

        if (!image && this.image) {
            // When there is image in editing, clean up any cached objects and elements
            this.clearDndHelpers();

            // Apply the changes, and add undo snapshot if necessary
            applyChange(
                this.editor,
                this.image,
                this.editInfo,
                this.lastSrc,
                this.wasResized,
                this.clonedImage
            );

            // Remove editing wrapper
            this.removeWrapper();

            this.editor.addUndoSnapshot(() => this.image, ChangeSource.ImageResize);

            if (selectImage) {
                this.editor.select(this.image);
            }

            this.image = null;
            this.editInfo = null;
            this.lastSrc = null;
            this.clonedImage = null;
        }

        if (!this.image && image?.isContentEditable) {
            // If there is new image to edit, enter editing mode for this image
            this.editor.addUndoSnapshot();
            this.image = image;

            // Get initial edit info
            this.editInfo = getEditInfoFromImage(image);

            //Check if the image was resized by the user
            this.wasResized = checkIfImageWasResized(this.image);

            operation =
                (canRegenerateImage(image) ? operation : ImageEditOperation.Resize) &
                this.allowedOperations;

            // Create and update editing wrapper and elements
            this.createWrapper(operation);
            this.updateWrapper();

            // Init drag and drop
            this.dndHelpers = [
                ...this.createDndHelpers(ImageEditElementClass.ResizeHandle, Resizer),
                ...this.createDndHelpers(ImageEditElementClass.RotateHandle, Rotator),
                ...this.createDndHelpers(ImageEditElementClass.CropHandle, Cropper),
                ...this.createDndHelpers(ImageEditElementClass.CropContainer, Cropper),
            ];

            this.editor.select(this.image);
            this.toggleImageVisibility(this.image, false /** showImage */);
        }
    }

    /**
     * quit editing mode when editor lose focus
     */
    private onBlur = () => {
        this.setEditingImage(null, true);
    };

    /**
     * Create editing wrapper for the image
     */
    private createWrapper(operation: ImageEditOperation | CompatibleImageEditOperation) {
        //Clone the image and insert the clone in a entity
        this.clonedImage = this.image.cloneNode(true) as HTMLImageElement;
        this.clonedImage.removeAttribute('id');
        this.wrapper = createElement(
            KnownCreateElementDataIndex.ImageEditWrapper,
            this.image.ownerDocument
        ) as HTMLSpanElement;
        this.wrapper.firstChild.appendChild(this.clonedImage);

        // keep the same vertical align
        const originalVerticalAlign = getStylePropertyValue(this.image, 'vertical-align');
        if (originalVerticalAlign) {
            this.wrapper.style.verticalAlign = originalVerticalAlign;
        }

        this.wrapper.style.display = Browser.isSafari ? 'inline-block' : 'inline-flex';

        // Cache current src so that we can compare it after edit see if src is changed
        this.lastSrc = this.image.getAttribute('src');

        // Set image src to original src to help show editing UI, also it will be used when regenerate image dataURL after editing
        this.clonedImage.src = this.editInfo.src;
        this.clonedImage.style.position = 'absolute';
        this.clonedImage.style.maxWidth = null;

        // Get HTML for all edit elements (resize handle, rotate handle, crop handle and overlay, ...) and create HTML element
        const options: ImageHtmlOptions = {
            borderColor: getColorString(this.options.borderColor, this.editor.isDarkMode()),
            rotateIconHTML: this.options.rotateIconHTML,
            rotateHandleBackColor: this.editor.isDarkMode()
                ? DARK_MODE_BGCOLOR
                : LIGHT_MODE_BGCOLOR,
            isSmallImage: isASmallImage(this.editInfo),
        };
        const htmlData: CreateElementData[] = [getResizeBordersHTML(options)];

        getObjectKeys(ImageEditHTMLMap).forEach(thisOperation => {
            if ((operation & thisOperation) == thisOperation) {
                arrayPush(
                    htmlData,
                    ImageEditHTMLMap[thisOperation](options, this.onShowResizeHandle)
                );
            }
        });

        htmlData.forEach(data => {
            const element = createElement(data, this.image.ownerDocument);
            if (element) {
                this.wrapper.appendChild(element);
            }
        });

        this.insertImageWrapper(this.editor, this.image, this.wrapper, this.editor.getZoomScale());
    }

    private toggleImageVisibility(image: HTMLImageElement, showImage: boolean) {
        const editorId = this.editor.getEditorDomAttribute('id');
        const doc = this.editor.getDocument();
        const editingId = 'editingId' + editorId;
        if (showImage) {
            removeGlobalCssStyle(doc, editingId);
        } else {
            const cssRule = `#${editorId} #${image.id} {visibility: hidden}`;
            setGlobalCssStyles(doc, cssRule, editingId);
        }
    }

    private insertImageWrapper(
        editor: IEditor,
        image: HTMLImageElement,
        wrapper: HTMLSpanElement,
        scale: number
    ) {
        this.zoomWrapper = copyElementRect(image, createZoomWrapper(editor, wrapper, scale));
        this.zoomWrapper.style.zIndex = `${getLatestZIndex(editor.getScrollContainer()) + 1}`;
        this.editor.getDocument().body.appendChild(this.zoomWrapper);
    }

    /**
     * Remove the temp wrapper of the image
     */
    private removeWrapper = () => {
        const doc = this.editor.getDocument();
        if (this.zoomWrapper && doc.body?.contains(this.zoomWrapper)) {
            doc.body?.removeChild(this.zoomWrapper);
            this.toggleImageVisibility(this.image, true /** showImage */);
        }
        this.wrapper = null;
        this.zoomWrapper = null;
    };

    /**
     * Update image edit elements to reflect current editing result
     * @param context
     */
    private updateWrapper = (context?: DragAndDropContext) => {
        const wrapper = this.wrapper;
        if (wrapper) {
            // Prepare: get related editing elements
            const cropContainers = getEditElements(wrapper, ImageEditElementClass.CropContainer);
            const cropOverlays = getEditElements(wrapper, ImageEditElementClass.CropOverlay);
            const resizeHandles = getEditElements(wrapper, ImageEditElementClass.ResizeHandle);
            const cropHandles = getEditElements(wrapper, ImageEditElementClass.CropHandle);

            // Cropping and resizing will show different UI, so check if it is cropping here first
            const isCropping = cropContainers.length == 1 && cropOverlays.length == 4;
            const {
                angleRad,
                bottomPercent,
                leftPercent,
                rightPercent,
                topPercent,
            } = this.editInfo;

            // Width/height of the image
            const {
                targetWidth,
                targetHeight,
                originalWidth,
                originalHeight,
                visibleWidth,
                visibleHeight,
            } = getGeneratedImageSize(this.editInfo, isCropping);
            const marginHorizontal = (targetWidth - visibleWidth) / 2;
            const marginVertical = (targetHeight - visibleHeight) / 2;
            const cropLeftPx = originalWidth * leftPercent;
            const cropRightPx = originalWidth * rightPercent;
            const cropTopPx = originalHeight * topPercent;
            const cropBottomPx = originalHeight * bottomPercent;

            // Update size and margin of the wrapper
            wrapper.style.width = getPx(visibleWidth);
            wrapper.style.height = getPx(visibleHeight);
            wrapper.style.margin = `${marginVertical}px ${marginHorizontal}px`;
            wrapper.style.transform = `rotate(${angleRad}rad)`;
            this.zoomWrapper.style.width = getPx(visibleWidth);
            this.zoomWrapper.style.height = getPx(visibleHeight);
            fitImageContainer(this.editor, this.zoomWrapper, angleRad);

            // Update the text-alignment to avoid the image to overflow if the parent element have align center or right
            // or if the direction is Right To Left
            wrapper.style.textAlign = isRtl(wrapper.parentNode) ? 'right' : 'left';

            // Update size of the image
            this.clonedImage.style.width = getPx(originalWidth);
            this.clonedImage.style.height = getPx(originalHeight);

            if (isCropping) {
                // For crop, we also need to set position of the overlays
                setSize(
                    cropContainers[0],
                    cropLeftPx,
                    cropTopPx,
                    cropRightPx,
                    cropBottomPx,
                    undefined,
                    undefined
                );
                setSize(cropOverlays[0], 0, 0, cropRightPx, undefined, undefined, cropTopPx);
                setSize(cropOverlays[1], undefined, 0, 0, cropBottomPx, cropRightPx, undefined);
                setSize(cropOverlays[2], cropLeftPx, undefined, 0, 0, undefined, cropBottomPx);
                setSize(cropOverlays[3], 0, cropTopPx, undefined, 0, cropLeftPx, undefined);
                updateHandleCursor(cropHandles, angleRad);
            } else {
                // For rotate/resize, set the margin of the image so that cropped part won't be visible
                this.clonedImage.style.margin = `${-cropTopPx}px 0 0 ${-cropLeftPx}px`;

                // Double check resize
                if (context?.elementClass == ImageEditElementClass.ResizeHandle) {
                    const clientWidth = wrapper.clientWidth;
                    const clientHeight = wrapper.clientHeight;
                    this.wasResized = true;
                    doubleCheckResize(
                        this.editInfo,
                        this.options.preserveRatio,
                        clientWidth,
                        clientHeight
                    );

                    this.updateWrapper();
                }

                updateHandleCursor(resizeHandles, angleRad);
            }
        }
    };

    /**
     * Create drag and drop helpers
     * @param wrapper
     * @param elementClass
     * @param dragAndDrop
     */
    private createDndHelpers(
        elementClass: ImageEditElementClass,
        dragAndDrop: DragAndDropHandler<DragAndDropContext, any>
    ): DragAndDropHelper<DragAndDropContext, any>[] {
        const commonContext = {
            editInfo: this.editInfo,
            options: this.options,
            elementClass,
        };
        const wrapper = this.wrapper;
        return wrapper
            ? getEditElements(wrapper, elementClass).map(
                  element =>
                      new DragAndDropHelper<DragAndDropContext, any>(
                          element,
                          {
                              ...commonContext,
                              x: element.dataset.x as DNDDirectionX,
                              y: element.dataset.y as DnDDirectionY,
                          },
                          this.updateWrapper,
                          dragAndDrop,
                          this.editor.getZoomScale()
                      )
              )
            : [];
    }

    /**
     * Clean up drag and drop helpers
     */
    private clearDndHelpers() {
        this.dndHelpers?.forEach(helper => helper.dispose());
        this.dndHelpers = null;
    }
}

function setSize(
    element: HTMLElement,
    left: number,
    top: number,
    right: number,
    bottom: number,
    width: number,
    height: number
) {
    element.style.left = getPx(left);
    element.style.top = getPx(top);
    element.style.right = getPx(right);
    element.style.bottom = getPx(bottom);
    element.style.width = getPx(width);
    element.style.height = getPx(height);
}

function getPx(value: number): string {
    return value === undefined ? null : value + 'px';
}

function getEditElements(wrapper: HTMLElement, elementClass: ImageEditElementClass): HTMLElement[] {
    return toArray(wrapper.querySelectorAll('.' + elementClass)) as HTMLElement[];
}

function isRtl(element: Node): boolean {
    return safeInstanceOf(element, 'HTMLElement')
        ? getComputedStyle(element, 'direction') == 'rtl'
        : false;
}

function handleRadIndexCalculator(angleRad: number): number {
    let idx = Math.round(angleRad / DirectionRad) % DIRECTIONS;
    return idx < 0 ? idx + DIRECTIONS : idx;
}

function rotateHandles(element: HTMLElement, angleRad: number): string {
    const radIndex = handleRadIndexCalculator(angleRad);
    const originalDirection = element.dataset.y + element.dataset.x;
    const originalIndex = DirectionOrder.indexOf(originalDirection);
    const rotatedIndex = originalIndex >= 0 && originalIndex + radIndex;
    return DirectionOrder[rotatedIndex % DIRECTIONS];
}

/**
 * Rotate the resizer and cropper handles according to the image position.
 * @param handles The resizer handles.
 * @param angleRad The angle that the image was rotated.
 */
function updateHandleCursor(handles: HTMLElement[], angleRad: number) {
    handles.map(handle => {
        handle.style.cursor = `${rotateHandles(handle, angleRad)}-resize`;
    });
}

/**
 * Check if the current image was resized by the user
 * @param image the current image
 * @returns if the user resized the image, returns true, otherwise, returns false
 */
function checkIfImageWasResized(image: HTMLImageElement): boolean {
    const { width, height, style } = image;
    const isMaxWidthInitial =
        style.maxWidth === '' || style.maxWidth === 'initial' || style.maxWidth === 'auto';
    if (
        isMaxWidthInitial &&
        (isFixedNumberValue(style.height) ||
            isFixedNumberValue(style.width) ||
            isFixedNumberValue(width) ||
            isFixedNumberValue(height))
    ) {
        return true;
    } else {
        return false;
    }
}

function isFixedNumberValue(value: string | number) {
    const numberValue = typeof value === 'string' ? parseInt(value) : value;
    return !isNaN(numberValue);
}

function isASmallImage(editInfo: ImageEditInfo) {
    const { widthPx, heightPx } = editInfo;
    return widthPx && heightPx && widthPx * widthPx < MAX_SMALL_SIZE_IMAGE;
}

function getColorString(color: string | ModeIndependentColor, isDarkMode: boolean): string {
    if (typeof color === 'string') {
        return color.trim();
    }
    return isDarkMode ? color.darkModeColor.trim() : color.lightModeColor.trim();
}

function fitImageContainer(editor: IEditor, zoomWrapper: HTMLElement, angle: number) {
    const angleIndex = handleRadIndexCalculator(angle);
    const isVertical = (angleIndex >= 2 && angleIndex < 4) || angleIndex >= 6;
    const editorTop = editor.getScrollContainer()?.getBoundingClientRect()?.top;
    const { top, width, height } = zoomWrapper?.getBoundingClientRect();
    if (editorTop > top) {
        const rotatePercent = 100 * Math.abs(angle);
        const zoomWrapperHeight = editorTop - top;
        const zoomWrapperHeightPercent = isVertical
            ? rotatePercent * (zoomWrapperHeight / width)
            : 100 * (zoomWrapperHeight / height);

        zoomWrapper.style.clipPath = `polygon(0 ${zoomWrapperHeightPercent}%, 100% ${zoomWrapperHeightPercent}%, 100% ${
            isVertical ? rotatePercent : '100'
        }%, 0  ${isVertical ? rotatePercent : '100'}%)`;
    }
}

function copyElementRect(originalElement: HTMLElement, element: HTMLElement) {
    const { top, left, right, bottom } = originalElement.getBoundingClientRect();
    element.style.top = `${top}px`;
    element.style.bottom = `${bottom}px`;
    element.style.right = `${right}px`;
    element.style.left = `${left}px`;
    return element;
}

function createZoomWrapper(editor: IEditor, wrapper: HTMLSpanElement, scale: number) {
    const zoomWrapper = editor.getDocument().createElement('div');
    zoomWrapper.style.transform = `scale(${scale || 1})`;
    zoomWrapper.style.transformOrigin = 'top left';
    zoomWrapper.style.position = 'fixed';
    zoomWrapper.appendChild(wrapper);
    return zoomWrapper;
}

function getStylePropertyValue(element: HTMLElement, property: string): string {
    return element.ownerDocument.defaultView.getComputedStyle(element).getPropertyValue(property);
}
