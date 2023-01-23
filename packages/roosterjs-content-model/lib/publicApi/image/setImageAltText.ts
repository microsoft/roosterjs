import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image box shadow for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param boxShadow The image box shadow
 */
export default function setImageAltText(editor: IExperimentalContentModelEditor, altText: string) {
    formatSegmentWithContentModel(editor, 'setImageAltText', (_, __, segment) => {
        if (segment?.segmentType == 'Image') {
            segment.alt = altText;
        }
    });
}
