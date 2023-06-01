import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set image box shadow for all selected images at selection.
 * @param editor The editor instance
 * @param boxShadow The image box boxShadow
 * @param margin The image margin for all sides (eg. "4px"), null to remove margin
 */
export default function setImageBoxShadow(
    editor: IContentModelEditor,
    boxShadow: string,
    margin?: string | null
) {
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
