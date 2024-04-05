import { formatImageWithContentModel } from '../utils/formatImageWithContentModel';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Set image size (in pixels). If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param width The image width in pixels
 * @param height The image height in pixels
 */
export function setImageSize(editor: IEditor, width: number, height: number) {
    editor.focus();

    formatImageWithContentModel(editor, 'setImageSize', (image: ContentModelImage) => {
        image.format = {
            width: `${width}px`,
            height: `${height}px`,
        };
    });
}
