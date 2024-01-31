import { formatSegment } from '../utils/formatSegment';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IStandaloneEditor) {
    editor.focus();

    formatSegment(
        editor,
        'toggleStrikethrough',
        (format, isTurningOn) => {
            format.strikethrough = !!isTurningOn;
        },
        format => !!format.strikethrough
    );
}
