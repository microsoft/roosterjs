import { formatSegment } from '../utils/formatSegment';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleItalic(editor: IStandaloneEditor) {
    editor.focus();

    formatSegment(
        editor,
        'toggleItalic',
        (format, isTurningOn) => {
            format.italic = !!isTurningOn;
        },
        format => !!format.italic
    );
}
