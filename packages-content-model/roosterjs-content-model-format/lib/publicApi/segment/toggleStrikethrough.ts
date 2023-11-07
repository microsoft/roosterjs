import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export function toggleStrikethrough(editor: IContentModelEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleStrikethrough',
        (format, isTurningOn) => {
            format.strikethrough = !!isTurningOn;
        },
        format => !!format.strikethrough
    );
}
