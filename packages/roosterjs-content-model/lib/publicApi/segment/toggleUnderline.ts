import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle underline style
 * @param editor The editor to operate on
 */
export default function toggleUnderline(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleUnderline',
        (segment, isTurningOn) => {
            segment.format.underline = !!isTurningOn;
        },
        segment => !!segment.format.underline
    );
}
