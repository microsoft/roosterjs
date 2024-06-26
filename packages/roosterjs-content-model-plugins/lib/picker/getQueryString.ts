import { splitTextSegment } from 'roosterjs-content-model-api';
import type {
    ContentModelText,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getQueryString(
    triggerCharacter: string,
    paragraph: ShallowMutableContentModelParagraph,
    previousSegment: ContentModelText,
    splittedSegmentResult?: ContentModelText[]
): string {
    let result = '';
    let i = paragraph.segments.indexOf(previousSegment);

    for (; i >= 0; i--) {
        const segment = paragraph.segments[i];

        if (segment.segmentType != 'Text') {
            result = '';
            break;
        }

        const index = segment.text.lastIndexOf(triggerCharacter);

        if (index >= 0) {
            result = segment.text.substring(index) + result;

            splittedSegmentResult?.unshift(
                index > 0
                    ? splitTextSegment(segment, paragraph, index, segment.text.length)
                    : segment
            );

            break;
        } else {
            result = segment.text + result;

            splittedSegmentResult?.unshift(segment);
        }
    }

    if (i < 0) {
        result = '';
    }

    return result;
}
