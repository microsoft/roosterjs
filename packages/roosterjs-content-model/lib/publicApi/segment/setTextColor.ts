import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set
 */
export default function setTextColor(editor: IExperimentalContentModelEditor, textColor: string) {
    formatWithContentModel(editor, 'setTextColor', model =>
        setSegmentStyle(
            model,
            segment => {
                segment.format.textColor = textColor;
            },
            undefined /* segmentHasStyleCallback*/,
            true /*includingFormatHandler*/
        )
    );
}
