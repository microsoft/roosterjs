import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export default function toggleBold(editor: IExperimentalContentModelEditor) {
    formatSegmentWithContentModel(
        editor,
        'toggleBold',
        (format, isTurningOn) => {
            format.fontWeight = isTurningOn ? 'bold' : undefined;
        },
        format => isBold(format.fontWeight)
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
