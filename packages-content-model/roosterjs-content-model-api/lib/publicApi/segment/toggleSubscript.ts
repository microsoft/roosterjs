import { formatSegment } from '../utils/formatSegment';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IStandaloneEditor) {
    editor.focus();

    formatSegment(
        editor,
        'toggleSubscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
    );
}
