import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export default function setFontName(editor: IExperimentalContentModelEditor, fontName: string) {
    formatSegmentWithContentModel(
        editor,
        'setFontName',
        format => {
            format.fontFamily = fontName;
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
