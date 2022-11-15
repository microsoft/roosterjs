import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export default function toggleBold(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleBold', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.fontWeight = isTurningOn ? 'bold' : undefined;
            },
            segment => isBold(segment.format.fontWeight)
        )
    );
}

function isBold(boldStyle?: string): boolean {
    return (
        !!boldStyle && (boldStyle == 'bold' || boldStyle == 'bolder' || parseInt(boldStyle) >= 600)
    );
}
