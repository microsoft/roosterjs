import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle underline style
 * @param editor The editor to operate on
 */
export default function toggleUnderline(editor: IContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleUnderline',
        (format, isTurningOn, segment) => {
            format.underline = !!isTurningOn;

            if (segment?.link) {
                segment.link.format.underline = !!isTurningOn;
            }
        },
        format => !!format.underline
    );
}
