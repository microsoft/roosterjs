import { applyChange } from './utils/applyChange';
import { canRegenerateImage } from './utils/canRegenerateImage';
import { checkIfImageWasResized, isASmallImage } from './utils/imageEditUtils';
import { createImageWrapper } from './utils/createImageWrapper';
import { Cropper } from './Cropper/cropperContext';
import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api';
import { getContentModelImage } from './utils/getContentModelImage';
import { getDropAndDragHelpers } from './utils/getDropAndDragHelpers';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { updateImageEditInfo } from './utils/updateImageEditInfo';
import { updateRotateHandle } from './Rotator/updateRotateHandle';
import { updateWrapper } from './utils/updateWrapper';
import {
    ChangeSource,
    getSelectedSegments,
    isElementOfType,
    isNodeOfType,
    unwrap,
    wrap,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropContext } from './types/DragAndDropContext';
import type { ImageHtmlOptions } from './types/ImageHtmlOptions';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    DOMInsertPoint,
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
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
export class ImageEditPlugin implements ImageEditor, EditorPlugin {
    private editor: IEditor | null = null;
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
        this.disposer = editor.attachDomEvent({
            blur: {
                beforeDispatch: () => {
                    this.formatImageWithContentModel(editor);
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
        if (this.editor) {
            switch (event.eventType) {
                case 'selectionChanged':
                    this.handleSelectionChangedEvent(this.editor, event);
                    break;
                case 'contentChanged':
                    if (
                        this.selectedImage &&
                        this.imageEditInfo &&
                        this.shadowSpan &&
                        event.source != ChangeSource.ImageResize
                    ) {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }
                    break;

                case 'keyDown':
                    if (this.selectedImage && this.imageEditInfo && this.shadowSpan) {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }
                    break;
            }
        }
    }

    private handleSelectionChangedEvent(editor: IEditor, event: SelectionChangedEvent) {
        if (event.newSelection?.type == 'image') {
            if (this.selectedImage && this.selectedImage !== event.newSelection.image) {
                this.formatImageWithContentModelOnSelectionChange(editor);
            }
            if (!this.selectedImage) {
                this.startRotateAndResize(editor, event.newSelection.image);
            }
        } else {
            if (this.selectedImage) {
                this.formatImageWithContentModelOnSelectionChange(editor);
            }
        }
    }

    private startEditing(
        editor: IEditor,
        image: HTMLImageElement,
        apiOperation?: ImageEditOperation
    ) {
        const contentModelImage = getContentModelImage(editor);
        const imageSpan = image.parentElement;
        if (
            !contentModelImage ||
            !imageSpan ||
            (imageSpan && !isElementOfType(imageSpan, 'span'))
        ) {
            return;
        }
        this.imageEditInfo = updateImageEditInfo(contentModelImage, image);
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
    }

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
        return (
            operation === 'resize' ||
            operation === 'rotate' ||
            operation === 'flip' ||
            operation === 'crop'
        );
    }

    public canRegenerateImage(image: HTMLImageElement): boolean {
        return canRegenerateImage(image) || canRegenerateImage(this.selectedImage);
    }

    public cropImage(editor: IEditor, image: HTMLImageElement) {
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            image = this.removeImageWrapper(editor, this.dndHelpers) ?? image;
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
        if (this.wrapper && this.selectedImage && this.shadowSpan) {
            image = this.removeImageWrapper(editor, this.dndHelpers) ?? image;
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

        this.formatImageWithContentModel(editor);
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

    private formatImageWithContentModelOnSelectionChange(editor: IEditor) {
        const selection = editor.getDOMSelection();
        let range: Range | null = null;
        if (selection?.type == 'range') {
            range = selection.range;
        }
        const insertPoint: DOMInsertPoint | null = range
            ? { node: range?.startContainer, offset: range?.endOffset }
            : null;
        if (
            this.lastSrc &&
            this.selectedImage &&
            this.imageEditInfo &&
            this.clonedImage &&
            insertPoint
        ) {
            formatInsertPointWithContentModel(
                editor,
                insertPoint,
                (model, _context, insertPoint) => {
                    const selectedSegments = getSelectedSegments(model, false);
                    if (
                        this.lastSrc &&
                        this.selectedImage &&
                        this.imageEditInfo &&
                        this.clonedImage &&
                        selectedSegments.length === 1 &&
                        selectedSegments[0].segmentType == 'Image'
                    ) {
                        applyChange(
                            editor,
                            this.selectedImage,
                            selectedSegments[0],
                            this.imageEditInfo,
                            this.lastSrc,
                            this.wasImageResized || this.isCropMode,
                            this.clonedImage
                        );
                        if (insertPoint && selection?.type == 'range') {
                            selectedSegments[0].isSelected = false;
                            insertPoint.marker.isSelected = true;
                        }

                        return true;
                    }

                    return false;
                },
                {
                    selectionOverride: {
                        type: 'image',
                        image: this.selectedImage,
                    },
                }
            );

            this.removeImageWrapper(editor, this.dndHelpers);
        }
    }

    private formatImageWithContentModel(editor: IEditor) {
        if (this.lastSrc && this.selectedImage && this.imageEditInfo && this.clonedImage) {
            editor.formatContentModel((model, _context) => {
                const selectedSegments = getSelectedSegments(model, false);
                if (
                    this.lastSrc &&
                    this.selectedImage &&
                    this.imageEditInfo &&
                    this.clonedImage &&
                    selectedSegments.length === 1 &&
                    selectedSegments[0].segmentType == 'Image'
                ) {
                    applyChange(
                        editor,
                        this.selectedImage,
                        selectedSegments[0],
                        this.imageEditInfo,
                        this.lastSrc,
                        this.wasImageResized || this.isCropMode,
                        this.clonedImage
                    );
                    return true;
                }
                return false;
            });
        }
    }

    private removeImageWrapper(
        editor: IEditor,
        resizeHelpers: DragAndDropHelper<DragAndDropContext, any>[]
    ) {
        let image: Node | null = null;
        if (this.shadowSpan && this.shadowSpan.parentElement) {
            image = unwrap(this.shadowSpan);
        }
        resizeHelpers.forEach(helper => helper.dispose());
        this.cleanInfo();

        return this.getImageWrappedImage(editor.getDocument(), image);
    }

    private getImageWrappedImage(doc: Document, node: Node | null): HTMLImageElement | null {
        if (node && isNodeOfType(node, 'ELEMENT_NODE')) {
            if (isElementOfType(node, 'img')) {
                wrap(doc, node, 'span');
                return node;
            } else if (node.firstChild && node.childElementCount === 1) {
                return this.getImageWrappedImage(doc, node.firstChild);
            }
            return null;
        }
        return null;
    }

    public flipImage(
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

    public rotateImage(editor: IEditor, image: HTMLImageElement, angleRad: number) {
        this.editImage(editor, image, 'rotate', imageEditInfo => {
            imageEditInfo.angleRad = (imageEditInfo.angleRad || 0) + angleRad;
        });
    }

    //EXPOSED FOR TEST ONLY
    public getWrapper() {
        return this.wrapper;
    }
}
