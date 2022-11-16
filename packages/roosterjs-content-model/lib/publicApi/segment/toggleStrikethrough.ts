import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleStrikethrough',
        (segment, isTurningOn) => {
            segment.format.strikethrough = !!isTurningOn;
        },
        segment => !!segment.format.strikethrough
    );
}
