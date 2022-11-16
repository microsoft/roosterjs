import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set background color
 * @param editor The editor to operate on
 * @param backgroundColor The color to set
 */
export default function setBackgroundColor(
    editor: IExperimentalContentModelEditor,
    backgroundColor: string
) {
    formatSegmentWithContentModel(editor, 'setBackgroundColor', segment => {
        segment.format.backgroundColor = backgroundColor;
    });
}
