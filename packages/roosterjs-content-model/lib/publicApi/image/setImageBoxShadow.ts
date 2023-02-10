import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set image box shadow for all selected images at selection.
 * @param editor The editor instance
 * @param boxShadow The image box shadow
 */
export default function setImageBoxShadow(editor: IContentModelEditor, boxShadow: string) {
    formatImageWithContentModel(editor, 'setImageBoxShadow', (image: ContentModelImage) => {
        image.format.boxShadow = boxShadow;
    });
}
