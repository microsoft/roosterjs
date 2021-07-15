import applyChange from './editInfoUtils/applyChange';
import canRegenerateImage from './api/canRegenerateImage';
import Cropper, { getCropHTML } from './imageEditors/Cropper';
import deleteEditInfo from './editInfoUtils/deleteEditInfo';
import DragAndDropContext, { X, Y } from './types/DragAndDropContext';
import DragAndDropHandler from '../../pluginUtils/DragAndDropHandler';
import DragAndDropHelper from '../../pluginUtils/DragAndDropHelper';
import getEditInfoFromImage from './editInfoUtils/getEditInfoFromImage';
import getGeneratedImageSize from './editInfoUtils/getGeneratedImageSize';
import ImageEditInfo from './types/ImageEditInfo';
import ImageHtmlOptions from './types/ImageHtmlOptions';
import Rotator, { getRotateHTML, ROTATE_GAP, ROTATE_SIZE } from './imageEditors/Rotator';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { insertEntity } from 'roosterjs-editor-api';
import Resizer, {
    doubleCheckResize,
    getSideResizeHTML,
    getCornerResizeHTML,
} from './imageEditors/Resizer';
import {
    ExperimentalFeatures,
    ImageEditOperation,
    ImageEditOptions,
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    EntityOperation,
    Entity,
    Keys,
    PositionType,
} from 'roosterjs-editor-types';
import {
    Browser,
    fromHtml,
    getEntitySelector,
    getEntityFromElement,
    matchesSelector,
    safeInstanceOf,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';

const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

/**
 * Map the experimental features to image edit operations to help determine which operation is allowed
 */
const FeatureToOperationMap = {
    [ExperimentalFeatures.SingleDirectionResize]: ImageEditOperation.SideResize,
    [ExperimentalFeatures.ImageRotate]: ImageEditOperation.Rotate,
    [ExperimentalFeatures.ImageCrop]: ImageEditOperation.Crop,
};

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
 * A wrapper element to help hide cropped part of image
 */
const IMAGE_WRAPPER_HTML =
    '<div style="width:100%;height:100%;position:relative;overflow:hidden"></div>';

/**
 * Image edit entity name
 */
const IMAGE_EDIT_WRAPPER_ENTITY_TYPE = 'IMAGE_EDIT_WRAPPER';

/**
 * Default background colors for rotate handle
 */
const LIGHT_MODE_BGCOLOR = 'white';
const DARK_MODE_BGCOLOR = '#333';

/**
 * ImageEdit plugin provides the ability to edit an inline image in editor, including image resizing, rotation and cropping
 */
export default class ImageEdit implements EditorPlugin {
    protected editor: IEditor;
    protected options: ImageEditOptions;
    private disposer: () => void;

    // Allowed editing operations
    private allowedOperations: ImageEditOperation = ImageEditOperation.CornerResize;

    // Current editing image
    private image: HTMLImageElement;

    // Current edit info of the image. All changes user made will be stored in this object.
    // We use this object to update the editing UI, and finally we will use this object to generate
    // the new image if necessary
    private editInfo: ImageEditInfo;

    // Src of the image before current editing
    private lastSrc: string;

    // Drag and drop helper objects
    private dndHelpers: DragAndDropHelper<DragAndDropContext, any>[];

    /**
     * Create a new instance of ImageEdit
     * @param options Image editing options
     */
    constructor(options?: ImageEditOptions) {
        this.options = {
            ...DefaultOptions,
            ...(options || {}),
        };
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

        // Read current enabled features from editor to determine which editing operations are allowed
        Object.keys(FeatureToOperationMap).forEach((key: keyof typeof FeatureToOperationMap) => {
            this.allowedOperations |= this.editor.isFeatureEnabled(key)
                ? FeatureToOperationMap[key]
                : 0;
        });
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
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.MouseDown:
                this.setEditingImage(null);
                break;

            case PluginEventType.MouseUp:
                const target = e.rawEvent.target;
                if (
                    e.isClicking &&
                    e.rawEvent.button == 0 &&
                    safeInstanceOf(target, 'HTMLImageElement') &&
                    target.isContentEditable &&
                    matchesSelector(target, this.options.imageSelector)
                ) {
                    this.setEditingImage(target, ImageEditOperation.ResizeAndRotate);
                }

                break;

            case PluginEventType.KeyDown:
                const key = e.rawEvent.which;
                if (key == Keys.DELETE || key == Keys.BACKSPACE) {
                    // Set current editing image to null and select the image if any, and do not prevent default of the event
                    // so that browser will delete the selected image for us
                    this.setEditingImage(null, true /*selectImage*/);
                } else if (key == Keys.ESCAPE && this.image) {
                    // Press ESC should cancel current editing operation, resume back to original edit info
                    this.editInfo = getEditInfoFromImage(this.image);
                    this.setEditingImage(null);
                    e.rawEvent.preventDefault();
                } else if (key != SHIFT_KEYCODE && key != CTRL_KEYCODE && key != ALT_KEYCODE) {
                    // For other key, just unselect current image and select it. If this is an input key, the image will be replaced
                    this.setEditingImage(null, true /*selectImage*/);
                }
                break;

            case PluginEventType.ContentChanged:
                if (
                    e.source != ChangeSource.InsertEntity ||
                    (<Entity>e.data).type != IMAGE_EDIT_WRAPPER_ENTITY_TYPE
                ) {
                    // After contentChanged event, the current image wrapper may not be valid any more, remove all of them if any
                    this.editor.queryElements(
                        getEntitySelector(IMAGE_EDIT_WRAPPER_ENTITY_TYPE),
                        this.removeWrapper
                    );
                }

                break;

            case PluginEventType.EntityOperation:
                if (e.entity.type == IMAGE_EDIT_WRAPPER_ENTITY_TYPE) {
                    if (e.operation == EntityOperation.ReplaceTemporaryContent) {
                        this.removeWrapper(e.entity.wrapper);
                    } else if (e.operation == EntityOperation.Click) {
                        e.rawEvent.preventDefault();
                    }
                }
                break;

            case PluginEventType.ExtractContentWithDom:
                // When extract content, remove all image info since they may not be valid when load the content again
                toArray(e.clonedRoot.querySelectorAll(this.options.imageSelector)).forEach(img => {
                    deleteEditInfo(img as HTMLImageElement);
                });
                break;
        }
    }

    /**
     * Set current image for edit. If there is already image in editing, it will quit editing mode and any pending editing
     * operation will be submitted
     * @param image The image to edit
     * @param operation The editing operation
     */
    setEditingImage(image: HTMLImageElement, operation: ImageEditOperation): void;

    /**
     * Stop editing image. If there is already image in editing, it will quit editing mode and any pending editing
     * operation will be submitted
     * @param image The image to edit
     * @param selectImage True to select this image after quit editing mode
     */
    setEditingImage(image: null, selectImage?: boolean): void;

    setEditingImage(
        image: HTMLImageElement | null,
        operationOrSelect?: ImageEditOperation | boolean
    ) {
        let operation =
            typeof operationOrSelect === 'number' ? operationOrSelect : ImageEditOperation.None;
        const selectImage = typeof operationOrSelect === 'number' ? false : !!operationOrSelect;

        if (this.image) {
            // When there is image in editing, clean up any cached objects and elements
            this.clearDndHelpers();

            // Apply the changes, and add undo snapshot if necessary
            if (applyChange(this.editor, this.image, this.editInfo, this.lastSrc)) {
                this.editor.addUndoSnapshot(() => this.image, ChangeSource.ImageResize);
            }

            // Remove editing wrapper
            const wrapper = this.getImageWrapper(this.image);
            if (wrapper) {
                this.removeWrapper(wrapper);
            }

            if (selectImage) {
                this.editor.select(this.image);
            }

            this.image = null;
            this.editInfo = null;
            this.lastSrc = null;
        }

        if (!this.image && image?.isContentEditable) {
            // If there is new image to edit, enter editing mode for this image
            this.editor.addUndoSnapshot();
            this.image = image;

            // Get initial edit info
            this.editInfo = getEditInfoFromImage(image);
            operation =
                (canRegenerateImage(image) ? operation : ImageEditOperation.Resize) &
                this.allowedOperations;

            // Create and update editing wrapper and elements
            const wrapper = this.createWrapper(operation);
            this.updateWrapper();

            // Init drag and drop
            this.dndHelpers = [
                ...this.createDndHelpers(ImageEditElementClass.ResizeHandle, Resizer),
                ...this.createDndHelpers(ImageEditElementClass.RotateHandle, Rotator),
                ...this.createDndHelpers(ImageEditElementClass.CropHandle, Cropper),
                ...this.createDndHelpers(ImageEditElementClass.CropContainer, Cropper),
            ];

            // Put cursor next to the image
            this.editor.select(wrapper, PositionType.After);
        }
    }

    /**
     * quit editing mode when editor lose focus
     */
    private onBlur = () => {
        this.setEditingImage(null);
    };

    /**
     * Create editing wrapper for the image
     */
    private createWrapper(operation: ImageEditOperation) {
        // Wrap the image with an entity so that we can easily retrieve it later
        const { wrapper } = insertEntity(
            this.editor,
            IMAGE_EDIT_WRAPPER_ENTITY_TYPE,
            wrap(this.image, IMAGE_WRAPPER_HTML),
            false /*isBlock*/,
            true /*isReadonly*/
        );

        wrapper.style.position = 'relative';
        wrapper.style.maxWidth = '100%';
        wrapper.style.verticalAlign = 'bottom';
        wrapper.style.display = Browser.isSafari ? 'inline-block' : 'inline-flex';

        // Cache current src so that we can compare it after edit see if src is changed
        this.lastSrc = this.image.src;

        // Set image src to original src to help show editing UI, also it will be used when regenerate image dataURL after editing
        this.image.src = this.editInfo.src;
        this.image.style.position = 'absolute';
        this.image.style.maxWidth = null;

        // Get HTML for all edit elements (resize handle, rotate handle, crop handle and overlay, ...) and create HTML element
        const options: ImageHtmlOptions = {
            borderColor: this.options.borderColor,
            rotateIconHTML: this.options.rotateIconHTML,
            rotateHandleBackColor: this.editor.isDarkMode()
                ? DARK_MODE_BGCOLOR
                : LIGHT_MODE_BGCOLOR,
        };
        const html = ((Object.keys(ImageEditHTMLMap) as any[]) as (keyof typeof ImageEditHTMLMap)[])
            .map(thisOperation =>
                (operation & thisOperation) == thisOperation
                    ? ImageEditHTMLMap[thisOperation](options)
                    : ''
            )
            .join('');

        fromHtml(html, this.image.ownerDocument).forEach(node => wrapper.appendChild(node));

        return wrapper;
    }

    /**
     * Get image wrapper from image
     * @param image The image to get wrapper from
     */
    private getImageWrapper(image: HTMLImageElement): HTMLElement {
        // Get the image wrapper from image using Entity API
        const entity = getEntityFromElement(image?.parentNode?.parentNode as HTMLElement);

        return entity?.type == IMAGE_EDIT_WRAPPER_ENTITY_TYPE ? entity.wrapper : null;
    }

    /**
     * Remove the temp wrapper of the image
     * @param wrapper The wrapper object to remove. If not specified, remove all existing wrappers.
     */
    private removeWrapper = (wrapper: HTMLElement) => {
        const parent = wrapper?.parentNode;
        const img = wrapper?.querySelector('img');

        if (img && parent) {
            img.style.position = '';
            img.style.maxWidth = '100%';
            img.style.margin = null;

            parent.insertBefore(img, wrapper);
            parent.removeChild(wrapper);
        }
    };

    /**
     * Update image edit elements to reflect current editing result
     * @param context
     */
    private updateWrapper = (context?: DragAndDropContext) => {
        const wrapper = this.getImageWrapper(this.image);
        if (wrapper) {
            // Prepare: get related editing elements
            const cropContainers = getEditElements(wrapper, ImageEditElementClass.CropContainer);
            const cropOverlays = getEditElements(wrapper, ImageEditElementClass.CropOverlay);
            const rotateCenter = getEditElements(wrapper, ImageEditElementClass.RotateCenter)[0];
            const rotateHandle = getEditElements(wrapper, ImageEditElementClass.RotateHandle)[0];

            // Cropping and resizing will show different UI, so check if it is cropping here first
            const isCropping = cropContainers.length == 1 && cropOverlays.length == 4;
            const {
                angleRad,
                heightPx,
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

            // Update size of the image
            this.image.style.width = getPx(originalWidth);
            this.image.style.height = getPx(originalHeight);

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
            } else {
                // For rotate/resize, set the margin of the image so that cropped part won't be visible
                this.image.style.margin = `${-cropTopPx}px 0 0 ${-cropLeftPx}px`;

                // Double check resize
                if (context?.elementClass == ImageEditElementClass.ResizeHandle) {
                    const clientWidth = wrapper.clientWidth;
                    const clientHeight = wrapper.clientHeight;
                    doubleCheckResize(
                        this.editInfo,
                        this.options.preserveRatio,
                        clientWidth,
                        clientHeight
                    );

                    this.updateWrapper();
                }

                // Move rotate handle. When image is very close to the border of editor, rotate handle may not be visible.
                // Fix it by reduce the distance from image to rotate handle
                const distance = this.editor.getRelativeDistanceToEditor(
                    wrapper,
                    true /*addScroll*/
                );

                if (rotateCenter && rotateHandle && distance) {
                    const cosAngle = Math.cos(angleRad);
                    const adjustedDistance =
                        cosAngle <= 0
                            ? Number.MAX_SAFE_INTEGER
                            : (distance[1] + heightPx / 2 + marginVertical) / cosAngle -
                              heightPx / 2;
                    const rotateGap = Math.max(Math.min(ROTATE_GAP, adjustedDistance), 0);
                    const rotateTop = Math.max(
                        Math.min(ROTATE_SIZE, adjustedDistance - rotateGap),
                        0
                    );
                    rotateCenter.style.top = getPx(-rotateGap);
                    rotateCenter.style.height = getPx(rotateGap);
                    rotateHandle.style.top = getPx(-rotateTop);
                }
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
        const wrapper = this.getImageWrapper(this.image);

        return wrapper
            ? getEditElements(wrapper, elementClass).map(
                  element =>
                      new DragAndDropHelper<DragAndDropContext, any>(
                          element,
                          {
                              ...commonContext,
                              x: element.dataset.x as X,
                              y: element.dataset.y as Y,
                          },
                          this.updateWrapper,
                          dragAndDrop
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
