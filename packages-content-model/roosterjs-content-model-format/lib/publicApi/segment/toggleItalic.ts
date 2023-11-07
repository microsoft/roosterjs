import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export function toggleItalic(editor: IContentModelEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleItalic',
        (format, isTurningOn) => {
            format.italic = !!isTurningOn;
        },
        format => !!format.italic
    );
}
