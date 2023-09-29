import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleItalic(editor: IContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleItalic',
        (format, isTurningOn) => {
            format.italic = !!isTurningOn;
        },
        format => !!format.italic
    );
}
