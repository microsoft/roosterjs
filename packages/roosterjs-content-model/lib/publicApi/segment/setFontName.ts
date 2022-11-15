import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export default function setFontName(editor: IExperimentalContentModelEditor, fontName: string) {
    formatWithContentModel(editor, 'setFontName', model =>
        setSegmentStyle(
            model,
            segment => {
                segment.format.fontFamily = fontName;
            },
            undefined /* segmentHasStyleCallback*/,
            true /*includingFormatHandler*/
        )
    );
}
