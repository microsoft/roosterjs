import { formatImageWithContentModel } from '../utils/formatImageWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set the width and height of all selected images.
 * @param editor The editor instance
 * @param width The image width as a CSS value (e.g. "200px" or "50%"). An empty string clears the explicit width.
 * @param height The image height as a CSS value (e.g. "100px" or "auto"). An empty string clears the explicit height.
 */
export function setImageSize(editor: IEditor, width: string, height: string) {
    editor.focus();

    formatImageWithContentModel(editor, 'setImageSize', image => {
        image.format.width = width;
        image.format.height = height;
    });
}
