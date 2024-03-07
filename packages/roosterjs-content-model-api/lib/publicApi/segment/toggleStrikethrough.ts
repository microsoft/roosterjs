import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export function toggleStrikethrough(editor: IEditor) {
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
