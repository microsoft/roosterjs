import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export default function toggleSuperscript(editor: IEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleSuperscript',
        (format, isTurningOn) => {
            format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
        },
        format => format.superOrSubScriptSequence?.split(' ').pop() == 'super'
    );
}
