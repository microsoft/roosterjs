import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
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
    formatSegmentWithContentModel(editor, 'setImageBorderColor', (_, __, segment) => {
        if (segment?.segmentType == 'Image') {
            segment.format.boxShadow = boxShadow;
        }
    });
}
