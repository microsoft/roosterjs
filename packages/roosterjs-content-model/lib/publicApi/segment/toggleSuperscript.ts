import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export default function toggleSuperscript(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleSuperscript',
        (segment, isTurningOn) => {
            segment.format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
        },
        segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'super'
    );
}
