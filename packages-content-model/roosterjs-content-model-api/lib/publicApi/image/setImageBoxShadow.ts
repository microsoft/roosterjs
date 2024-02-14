import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import type { ContentModelImage, IEditor } from 'roosterjs-content-model-types';

/**
 * Set image box shadow for all selected images at selection.
 * @param editor The editor instance
 * @param boxShadow The image box boxShadow
 * @param margin The image margin for all sides (eg. "4px"), null to remove margin
 */
export default function setImageBoxShadow(
    editor: IEditor,
    boxShadow: string,
    margin?: string | null
) {
    editor.focus();

    formatImageWithContentModel(editor, 'setImageBoxShadow', (image: ContentModelImage) => {
        image.format.boxShadow = boxShadow;
        if (margin) {
            image.format.marginBottom = margin;
            image.format.marginLeft = margin;
            image.format.marginRight = margin;
            image.format.marginTop = margin;
        } else if (margin === null) {
            delete image.format.marginBottom;
            delete image.format.marginLeft;
            delete image.format.marginRight;
            delete image.format.marginTop;
        }
    });
}
