import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IStandaloneEditor) {
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
