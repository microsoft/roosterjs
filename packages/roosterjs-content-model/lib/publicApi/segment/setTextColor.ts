import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set
 */
export default function setTextColor(editor: IExperimentalContentModelEditor, textColor: string) {
    formatSegmentWithContentModel(
        editor,
        'setTextColor',
        format => {
            format.textColor = textColor;
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
