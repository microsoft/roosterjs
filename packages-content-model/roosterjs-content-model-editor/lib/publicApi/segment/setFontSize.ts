import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type {
    ContentModelParagraph,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set font size
 * @param editor The editor to operate on
 * @param fontSize The font size to set
 */
export default function setFontSize(editor: IContentModelEditor, fontSize: string) {
    formatSegmentWithContentModel(
        editor,
        'setFontSize',
        (format, _, __, paragraph) => setFontSizeInternal(fontSize, format, paragraph),
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}

/**
 * @internal
 * Internal set font function shared by setFontSize and changeFontSize
 */
export function setFontSizeInternal(
    fontSize: string,
    format: ContentModelSegmentFormat,
    paragraph: ContentModelParagraph | null
) {
    format.fontSize = fontSize;

    // Since we have set font size to segment, it can be smaller than the one in paragraph format, so delete font size from paragraph
    if (paragraph?.segmentFormat?.fontSize) {
        const size = paragraph.segmentFormat.fontSize;

        paragraph.segments.forEach(segment => {
            if (!segment.format.fontSize) {
                segment.format.fontSize = size;
            }
        });

        delete paragraph.segmentFormat.fontSize;
    }
}
