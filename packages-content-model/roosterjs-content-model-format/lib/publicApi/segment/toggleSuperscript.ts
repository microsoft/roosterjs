import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export function toggleSuperscript(editor: IContentModelEditor) {
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
