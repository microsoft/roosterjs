import { formatSegment } from '../utils/formatSegment';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export default function setFontName(editor: IStandaloneEditor, fontName: string) {
    editor.focus();

    formatSegment(
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
