import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleStrikethrough',
        (format, isTurningOn) => {
            format.strikethrough = !!isTurningOn;
        },
        format => !!format.strikethrough
    );
}
