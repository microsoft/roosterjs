import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IStandaloneEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleSubscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
    );
}
