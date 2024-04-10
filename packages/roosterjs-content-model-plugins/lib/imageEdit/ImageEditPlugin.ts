import DragAndDropContext from './types/DragAndDropContext';
import ImageHtmlOptions from './types/ImageHtmlOptions';
import { applyChanges } from './utils/applyChanges';
import { createImageWrapper } from './utils/createImageWrapper';
import { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import { getHTMLImageOptions } from './utils/getHTMLImageOptions';
import { getImageEditInfo } from './utils/getImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { ImageEditOptions } from './types/ImageEditOptions';
import { ResizeHandle } from './Resizer/createImageResizer';
import { Resizer } from './Resizer/resizerContext';
import { Rotator } from './Rotator/rotatorContext';
import { startDropAndDragHelpers } from './utils/startDropAndDragHelpers';
import { updateWrapper } from './utils/updateWrapper';

import type {
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
 */
export class ImageEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private shadowSpan: HTMLSpanElement | null = null;
    private selectedImage: HTMLImageElement | null = null;
    private wrapper: HTMLSpanElement | null = null;
    private imageEditInfo: ImageMetadataFormat | null = null;
    private imageHTMLOptions: ImageHtmlOptions | null = null;
    private dndHelpers: DragAndDropHelper<DragAndDropContext, any>[] = [];
    private initialEditInfo: ImageMetadataFormat | null = null;

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
                case 'mouseDown':
                    if (
                        this.selectedImage &&
                        this.imageEditInfo &&
                        this.shadowSpan !== event.rawEvent.target
                    ) {
                        this.removeImageWrapper(this.editor, this.dndHelpers);
                    }

                    break;
            }
        }
    }

    private handleSelectionChangedEvent(editor: IEditor, event: SelectionChangedEvent) {
        if (event.newSelection?.type == 'image' && !this.selectedImage) {
            this.startEditing(editor, event.newSelection.image);
        }
    }

    private startEditing(editor: IEditor, image: HTMLImageElement) {
        this.imageEditInfo = getImageEditInfo(image);
        this.initialEditInfo = { ...this.imageEditInfo };
        this.imageHTMLOptions = getHTMLImageOptions(editor, this.options, this.imageEditInfo);
        const { handles, rotators, wrapper, shadowSpan, imageClone } = createImageWrapper(
            editor,
            image,
            this.options,
            this.imageEditInfo,
            this.imageHTMLOptions
        );
        this.shadowSpan = shadowSpan;
        this.selectedImage = image;
        this.wrapper = wrapper;

        if (handles.length > 0) {
            handles.forEach(({ handle }) => {
                if (this.imageEditInfo) {
                    this.dndHelpers.push(
                        startDropAndDragHelpers(
                            handle,
                            this.imageEditInfo,
                            this.options,
                            ImageEditElementClass.ResizeHandle,
                            Resizer,
                            (context: DragAndDropContext, _handle?: HTMLElement) => {
                                this.resizeImage(
                                    editor,
                                    context,
                                    imageClone,
                                    handles,
                                    rotators?.rotator,
                                    rotators?.rotatorHandle,
                                    !!this.imageHTMLOptions?.isSmallImage
                                );
                            }
                        )
                    );
                }
            });
        }

        if (rotators) {
            this.dndHelpers.push(
                startDropAndDragHelpers(
                    rotators.rotator,
                    this.imageEditInfo,
                    this.options,
                    ImageEditElementClass.RotateHandle,
                    Rotator,
                    (context: DragAndDropContext, _handle?: HTMLElement) => {
                        this.rotateImage(
                            editor,
                            context,
                            imageClone,
                            rotators.rotator,
                            rotators.rotatorHandle,
                            handles,
                            !!this.imageHTMLOptions?.isSmallImage
                        );
                    }
                )
            );
        }

        updateWrapper(
            editor,
            this.imageEditInfo.angleRad ?? 0,
            this.wrapper,
            rotators?.rotator,
            rotators?.rotatorHandle,
            handles,
            !!this.imageHTMLOptions?.isSmallImage
        );

        editor.setDOMSelection({
            type: 'image',
            image: image,
        });
    }

    private resizeImage(
        editor: IEditor,
        context: DragAndDropContext,
        image: HTMLImageElement,
        handles: ResizeHandle[],
        rotator?: HTMLElement,
        rotatorHandle?: HTMLElement,
        isSmallImage?: boolean
    ) {
        if (image && this.wrapper && this.imageEditInfo) {
            const { widthPx, heightPx } = context.editInfo;
            image.style.width = `${widthPx}px`;
            image.style.height = `${heightPx}px`;
            this.wrapper.style.width = `${widthPx}px`;
            this.wrapper.style.height = `${heightPx}px`;
            this.imageEditInfo.widthPx = widthPx;
            this.imageEditInfo.heightPx = heightPx;
            updateWrapper(
                editor,
                this.imageEditInfo.angleRad ?? 0,
                this.wrapper,
                rotator,
                rotatorHandle,
                handles,
                isSmallImage
            );
        }
    }

    private rotateImage(
        editor: IEditor,
        context: DragAndDropContext,
        image: HTMLImageElement,
        rotator: HTMLElement,
        rotatorHandle: HTMLElement,
        handles?: ResizeHandle[],
        isSmallImage?: boolean
    ) {
        if (image && this.wrapper && this.imageEditInfo && this.shadowSpan && this.selectedImage) {
            const { angleRad } = context.editInfo;
            this.wrapper.style.transform = `rotate(${angleRad}rad)`;
            this.imageEditInfo.angleRad = angleRad;
            updateWrapper(
                editor,
                angleRad ?? 0,
                this.wrapper,
                rotator,
                rotatorHandle,
                handles,
                isSmallImage
            );
        }
    }

    private cleanInfo() {
        this.selectedImage = null;
        this.shadowSpan = null;
        this.wrapper = null;
        this.imageEditInfo = null;
        this.imageHTMLOptions = null;
        this.initialEditInfo = null;
        this.dndHelpers.forEach(helper => helper.dispose());
        this.dndHelpers = [];
    }

    private removeImageWrapper(
        editor: IEditor,
        resizeHelpers: DragAndDropHelper<DragAndDropContext, any>[]
    ) {
        if (this.selectedImage && this.imageEditInfo && this.initialEditInfo) {
            applyChanges(this.selectedImage, this.imageEditInfo, this.initialEditInfo);
        }
        const helper = editor.getDOMHelper();
        if (this.shadowSpan && this.shadowSpan.parentElement) {
            helper.unwrap(this.shadowSpan);
        }
        resizeHelpers.forEach(helper => helper.dispose());
        this.cleanInfo();
    }
}
