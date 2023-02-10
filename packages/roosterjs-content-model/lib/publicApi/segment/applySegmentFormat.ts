import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Bulk apply segment format to all selected content. This is usually used for format painter.
 * @param editor The editor to operate on
 * @param newFormat The segment format to apply
 */
export default function applySegmentFormat(
    editor: IContentModelEditor,
    newFormat: ContentModelSegmentFormat
) {
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
