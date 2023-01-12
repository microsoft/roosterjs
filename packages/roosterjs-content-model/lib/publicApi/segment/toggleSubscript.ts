import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleSubscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
    );
}
