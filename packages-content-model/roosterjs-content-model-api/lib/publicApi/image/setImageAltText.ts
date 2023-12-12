import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import type { ContentModelImage, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: IStandaloneEditor, altText: string) {
    formatImageWithContentModel(editor, 'setImageAltText', (image: ContentModelImage) => {
        image.alt = altText;
    });
}
