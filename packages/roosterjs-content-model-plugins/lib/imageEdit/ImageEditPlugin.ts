import DragAndDropContext from './types/DragAndDropContext';
import ImageEditInfo, { ResizeInfo } from './types/ImageEditInfo';
import { createImageResizer } from './Resizer/createImageResizer';
import { DragAndDropHelper } from '../pluginUtils/DragAndDrop/DragAndDropHelper';
import { getImageEditInfo } from './utils/getImageEditInfo';
import { ImageEditElementClass } from './types/ImageEditElementClass';
import { ImageEditOptions } from './types/ImageEditOptions';
import { isNodeOfType } from 'roosterjs-content-model-dom/';
import { Resizer } from './Resizer/resizerContext';
import { startDropAndDragHelpers } from './utils/startDropAndDragHelpers';
//import { setImageSize } from 'roosterjs-content-model-api';

import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    SelectionChangedEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: Partial<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
};

/**
 * ImageEdit plugin handles the following image editing features:
 * - Resize image
 * - Crop image
 * - Rotate image
 */
export class ImageEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private shadowSpan: HTMLElement | null = null;
    private resizeHelpers: DragAndDropHelper<DragAndDropContext, ResizeInfo>[] = [];
    private selectedImage: HTMLImageElement | null = null;
    private resizer: HTMLSpanElement | null = null;
    private imageEditInfo: ImageEditInfo | null = null;

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
                    if (this.selectedImage && this.shadowSpan && this.imageEditInfo) {
                        this.removeImageResizer(
                            this.editor,
                            this.shadowSpan,
                            this.imageEditInfo,
                            this.resizeHelpers
                        );
                    }
                    break;
            }
        }
    }

    private handleSelectionChangedEvent(editor: IEditor, event: SelectionChangedEvent) {
        if (event.newSelection?.type == 'image' && event.newSelection.image != this.selectedImage) {
            this.startResizer(editor, event.newSelection.image);
        } else if (
            this.imageEditInfo &&
            this.selectedImage &&
            (event.newSelection?.type == 'table' ||
                (event.newSelection?.type == 'range' &&
                    this.shadowSpan &&
                    !isImageContainer(event.newSelection.range, this.shadowSpan)))
        ) {
            this.removeImageResizer(
                editor,
                this.shadowSpan,
                this.imageEditInfo,
                this.resizeHelpers
            );
            this.selectedImage = null;
        }
    }

    private startResizer(editor: IEditor, image: HTMLImageElement) {
        this.imageEditInfo = getImageEditInfo(image);
        const { shadowSpan, handles, resizer, imageClone } = createImageResizer(
            editor,
            image,
            this.options
        );
        this.shadowSpan = shadowSpan;
        this.selectedImage = image;
        this.resizer = resizer;

        this.resizeHelpers = startDropAndDragHelpers(
            handles,
            this.imageEditInfo,
            this.options,
            ImageEditElementClass.ResizeHandle,
            Resizer,
            (context: DragAndDropContext, _handle?: HTMLElement) => {
                this.resizeImage(context, imageClone);
            }
        );
    }

    private resizeImage(context: DragAndDropContext, image?: HTMLImageElement) {
        if (image && this.resizer && this.shadowSpan && this.imageEditInfo) {
            const { widthPx, heightPx } = context.editInfo;
            image.style.width = `${widthPx}px`;
            image.style.height = `${heightPx}px`;
            this.resizer.style.width = `${widthPx}px`;
            this.resizer.style.height = `${heightPx}px`;
            this.imageEditInfo.widthPx = widthPx;
            this.imageEditInfo.heightPx = heightPx;
        }
    }

    private removeImageResizer(
        editor: IEditor,
        shadowSpan: HTMLElement | null,
        imageEditInfo: ImageEditInfo,
        resizeHelpers: DragAndDropHelper<DragAndDropContext, ResizeInfo>[]
    ) {
        const helper = editor.getDOMHelper();
        if (shadowSpan && shadowSpan.parentElement) {
            helper.unwrap(shadowSpan);
        }
        shadowSpan = null;
        resizeHelpers.forEach(helper => helper.dispose());
        // setImageSize(editor, imageEditInfo.widthPx, imageEditInfo.heightPx);
    }
}

const isImageContainer = (currentRange: Range, image: HTMLElement) => {
    const content = currentRange.commonAncestorContainer;
    if (content.firstChild && content.childNodes.length == 1) {
        return (
            isNodeOfType(content.firstChild, 'ELEMENT_NODE') &&
            content.firstChild.isEqualNode(image)
        );
    }
    return false;
};
