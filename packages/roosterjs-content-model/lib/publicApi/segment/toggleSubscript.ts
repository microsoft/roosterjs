import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleSubscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
    );
}
