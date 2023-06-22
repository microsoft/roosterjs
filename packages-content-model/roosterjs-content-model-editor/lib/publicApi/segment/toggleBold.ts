import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export default function toggleBold(editor: IContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleBold',
        (format, isTurningOn) => {
            format.fontWeight = isTurningOn ? 'bold' : 'normal';
        },
        (format, _, paragraph) =>
            isBold(
                typeof format.fontWeight == 'undefined'
                    ? paragraph?.decorator?.format.fontWeight
                    : format.fontWeight
            )
    );
}

/**
 * @internal
 */
export function isBold(boldStyle?: string): boolean {
    return (
        !!boldStyle && (boldStyle == 'bold' || boldStyle == 'bolder' || parseInt(boldStyle) >= 600)
    );
}
