import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export function toggleSubscript(editor: IContentModelEditor) {
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
