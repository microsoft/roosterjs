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
        (segment, isTurningOn) => {
            segment.format.fontWeight = isTurningOn ? 'bold' : undefined;
        },
        segment => isBold(segment.format.fontWeight)
    );
}

function isBold(boldStyle?: string): boolean {
    return (
        !!boldStyle && (boldStyle == 'bold' || boldStyle == 'bolder' || parseInt(boldStyle) >= 600)
    );
}
