import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor, ReadonlyContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Bulk apply segment format to all selected content. This is usually used for format painter.
 * @param editor The editor to operate on
 * @param newFormat The segment format to apply
 */
export function applySegmentFormat(editor: IEditor, newFormat: ReadonlyContentModelSegmentFormat) {
    formatSegmentWithContentModel(
        editor,
        'applySegmentFormat',
        format => {
            format.backgroundColor = newFormat.backgroundColor;
            format.fontFamily = newFormat.fontFamily;
            format.fontSize = newFormat.fontSize;
            format.fontWeight = newFormat.fontWeight;
            format.italic = newFormat.italic;
            format.strikethrough = newFormat.strikethrough;
            format.superOrSubScriptSequence = newFormat.superOrSubScriptSequence;
            format.textColor = newFormat.textColor;
            format.underline = newFormat.underline;
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
