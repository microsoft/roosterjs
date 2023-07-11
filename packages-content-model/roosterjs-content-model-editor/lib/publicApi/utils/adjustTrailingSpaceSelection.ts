import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

/**
 * Remove trailing space from the selection
 * If the trailing space is in a separate segment, remove the format from that segment.
 * @internal
 */
export function adjustTrailingSpaceSelection(
    segment: ContentModelSegment,
    paragraph: ContentModelParagraph | null
): [ContentModelSegment, ContentModelParagraph | null] {
    if (segment.segmentType == 'Text' && paragraph) {
        const index = paragraph?.segments.indexOf(segment) == paragraph?.segments.length - 1;
        const lastTextSegment = paragraph?.segments[paragraph?.segments.length - 2];
        if (
            index &&
            lastTextSegment &&
            lastTextSegment.isSelected &&
            lastTextSegment.segmentType === 'Text' &&
            isTrailingspace(segment, paragraph)
        ) {
            segment.format = lastTextSegment.format;
            paragraph.segments.pop();
        } else if (index) {
            const text = segment.text.trimRight();
            const trailingSpacing = segment.text.substring(text.length);
            if (text && trailingSpacing) {
                segment.text = text;
                const trailingSpacingSegment = createText(trailingSpacing);
                paragraph.segments.push(trailingSpacingSegment);
            }
        }
    }
    return [segment, paragraph];
}

function isTrailingspace(segment: ContentModelSegment, paragraph: ContentModelParagraph | null) {
    if (
        segment.segmentType == 'Text' &&
        segment.text.trim().length === 0 &&
        paragraph &&
        paragraph.segments.length > 0 &&
        paragraph.segments[paragraph.segments.length - 1] === segment
    ) {
        return true;
    }
}
