import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import type { ContentModelImage } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param altText The image alt text
 */
export function setImageAltText(editor: IContentModelEditor, altText: string) {
    editor.focus();

    formatImageWithContentModel(editor, 'setImageAltText', (image: ContentModelImage) => {
        image.alt = altText;
    });
}
