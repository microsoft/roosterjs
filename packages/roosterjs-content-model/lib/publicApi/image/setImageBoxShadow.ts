import formatImageWithContentModel from './formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image box shadow for all selected images at selection.
 * @param editor The editor instance
 * @param boxShadow The image box shadow
 */
export default function setImageBoxShadow(
    editor: IExperimentalContentModelEditor,
    boxShadow: string
) {
    formatImageWithContentModel(editor, 'setImageBoxShadow', (image: ContentModelImage) => {
        image.format.boxShadow = boxShadow;
    });
}
