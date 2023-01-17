import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * The alt attribute provides alternative information for an image if a user for some reason
 * cannot view it (because of slow connection, an error in the src attribute, or if the user
 * uses a screen reader). See https://www.w3schools.com/tags/att_img_alt.asp
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: IExperimentalContentModelEditor, altText: string) {
    formatSegmentWithContentModel(editor, 'setImageAltText', (_, __, segment) => {
        if (segment?.segmentType == 'Image') {
            segment.alt = altText;
        }
    });
}
