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
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'super'
    );
}
