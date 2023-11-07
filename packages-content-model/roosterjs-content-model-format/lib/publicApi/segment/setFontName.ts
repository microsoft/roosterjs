import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export function setFontName(editor: IContentModelEditor, fontName: string) {
    editor.focus();

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
