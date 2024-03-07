import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export function toggleItalic(editor: IEditor) {
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
