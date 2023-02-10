import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: IContentModelEditor, altText: string) {
    formatImageWithContentModel(editor, 'setImageAltText', (image: ContentModelImage) => {
        image.alt = altText;
    });
}
