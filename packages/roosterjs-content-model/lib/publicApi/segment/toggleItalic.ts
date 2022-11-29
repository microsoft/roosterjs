import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleItalic(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleItalic',
        (segment, isTurningOn) => {
            segment.format.italic = !!isTurningOn;
        },
        segment => !!segment.format.italic
    );
}
