import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set font size
 * @param editor The editor to operate on
 * @param fontSize The font size to set
 */
export default function setFontSize(editor: IExperimentalContentModelEditor, fontSize: string) {
    formatWithContentModel(editor, 'setFontSize', model =>
        setSegmentStyle(
            model,
            segment => {
                segment.format.fontSize = fontSize;
            },
            undefined /* segmentHasStyleCallback*/,
            true /*includingFormatHandler*/
        )
    );
}
