import { formatImageWithContentModel } from '../utils/formatImageWithContentModel';
import type { ContentModelImage, IEditor, ImageTextWrap } from 'roosterjs-content-model-types';

/**
 * Set how text wraps around all selected images at selection. If no image is contained
 * in selection, do nothing.
 * - inline: display: inline
 * - square: display: inline; float: left
 * - topAndBottom: display: block
 * @param editor The editor instance
 * @param textWrap The text wrap type to apply
 */
export function setImageTextWrap(editor: IEditor, textWrap: ImageTextWrap) {
    editor.focus();

    formatImageWithContentModel(editor, 'setImageTextWrap', (image: ContentModelImage) => {
        switch (textWrap) {
            case 'inline':
                image.format.display = 'inline';
                delete image.format.float;
                break;
            case 'square':
                image.format.display = 'inline';
                image.format.float = 'left';
                break;
            case 'topAndBottom':
                image.format.display = 'block';
                delete image.format.float;
                break;
        }
    });
}
