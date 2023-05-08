import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export default function setFontName(editor: IContentModelEditor, fontName: string) {
    formatSegmentWithContentModel(
        editor,
        'setFontName',
        (format, _, segment) => {
            format.fontFamily = fontName;

            if (segment?.code) {
                segment.code.format.fontFamily = fontName;
            }
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
