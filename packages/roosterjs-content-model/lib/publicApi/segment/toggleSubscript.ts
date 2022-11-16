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
        (segment, isTurningOn) => {
            segment.format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
    );
}
