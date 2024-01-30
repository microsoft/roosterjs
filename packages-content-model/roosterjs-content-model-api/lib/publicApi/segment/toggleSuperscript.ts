import { formatSegment } from '../utils/formatSegment';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export default function toggleSuperscript(editor: IStandaloneEditor) {
    editor.focus();

    formatSegment(
        editor,
        'toggleSuperscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'super'
    );
}
