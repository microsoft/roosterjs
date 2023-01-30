import applyImageBorderFormat from '../../modelApi/image/applyImageBorderFormat';
import formatImageWithContentModel from './formatImageWithContentModel';
import { Border } from '../../domUtils/borderValues';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image border style for all selected images at selection.
 * @param editor The editor instance
 * @param color border color
 * @param style border style
 * @param width border width
 * @param isPt (optional) if false it will consider the width in pixels
 */
export default function setImageBorder(
    editor: IExperimentalContentModelEditor,
    border: Border,
    isPt?: boolean
) {
    formatImageWithContentModel(editor, 'setImageBorder', (image: ContentModelImage) => {
        applyImageBorderFormat(image, border, isPt);
    });
}
