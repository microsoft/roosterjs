import { EditorPlugin, ImageEditOperation } from 'roosterjs-editor-types';
import type { CompatibleImageEditOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Define the interface of ImageEdit plugin
 */
export default interface ImageEditPlugin extends EditorPlugin {
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
}
