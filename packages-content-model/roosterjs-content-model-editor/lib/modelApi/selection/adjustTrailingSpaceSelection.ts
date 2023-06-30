import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function adjustTrailingSpaceSelection(
    segment: ContentModelSegment,
    paragraph: ContentModelParagraph | null
): [ContentModelSegment, ContentModelParagraph | null] | null {
    if (segment.segmentType == 'Text' && paragraph) {
        const text = segment.text.trimRight();
        const trailingSpacing = segment.text.substring(text.length);
        if (text && trailingSpacing) {
            segment.text = text;
            const trailingSpacingSegment = createText(trailingSpacing);
            paragraph.segments.push(trailingSpacingSegment);
        } else if (text && !trailingSpacing) {
            segment.text = paragraph.segments
                .map(segment => {
                    if (segment.segmentType == 'Text') {
                        return segment.text;
                    }
                })
                .join('');
            paragraph.segments.splice(0, paragraph.segments.length, segment);
        } else {
            return null;
        }
    }
    return [segment, paragraph];
}
