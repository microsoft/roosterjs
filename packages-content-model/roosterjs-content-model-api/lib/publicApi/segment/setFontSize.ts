import { formatSegment } from '../utils/formatSegment';
import type {
    ContentModelParagraph,
    ContentModelSegmentFormat,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

/**
 * Set font size
 * @param editor The editor to operate on
 * @param fontSize The font size to set
 */
export default function setFontSize(editor: IStandaloneEditor, fontSize: string) {
    editor.focus();

    formatSegment(
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
