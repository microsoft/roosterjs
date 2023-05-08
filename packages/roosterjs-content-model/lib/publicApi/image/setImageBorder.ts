import applyImageBorderFormat from '../../modelApi/image/applyImageBorderFormat';
import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { Border } from '../../publicTypes/interface/Border';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set image border style for all selected images at selection.
 * @param editor The editor instance
 * @param border the border format object. Ex: { color: 'red', width: '10px', style: 'solid'}, if one of the value in object is undefined
 * its value will not be changed. Passing null instead of an object will remove the border
 * @param borderRadius the border radius value, if undefined, the border radius will keep the actual value
 */
export default function setImageBorder(
    editor: IContentModelEditor,
    border: Border | null,
    borderRadius?: string
) {
    formatImageWithContentModel(editor, 'setImageBorder', (image: ContentModelImage) => {
        applyImageBorderFormat(image, border, borderRadius);
    });
}
