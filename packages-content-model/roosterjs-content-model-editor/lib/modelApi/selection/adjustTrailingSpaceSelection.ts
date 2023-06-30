import { ContentModelSegment } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function adjustTrailingSpaceSelection(
    segment: ContentModelSegment,
    segments: ContentModelSegment[],
    position?: number
) {
    if (segment.segmentType == 'Text') {
        const text = segment.text.trimRight();
        const trailingSpacing = segment.text.substring(text.length);
        const trailingSpacingSegment = createText(trailingSpacing);
        segment.text = text;
        if (position != undefined) {
            segments.splice(position, 0, trailingSpacingSegment);
        } else {
            segments.push(trailingSpacingSegment);
        }
    }
}
