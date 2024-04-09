import { splitTextSegment } from '../pluginUtils/splitTextSegment';
import type { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getQueryString(
    triggerCharacter: string,
    paragraph: ContentModelParagraph,
    previousSegment: ContentModelText,
    splittedSegmentResult?: ContentModelText[]
): string {
    let result = '';

    for (let i = paragraph.segments.indexOf(previousSegment); i >= 0; i--) {
        const segment = paragraph.segments[i];

        if (segment.segmentType != 'Text') {
            result = '';
            break;
        }

        const index = segment.text.lastIndexOf(triggerCharacter);

        if (index >= 0) {
            result = segment.text.substring(index) + result;

            splittedSegmentResult?.push(
                index > 0
                    ? splitTextSegment(segment, paragraph, index, segment.text.length)
                    : segment
            );

            break;
        } else {
            result = segment.text + result;

            splittedSegmentResult?.push(segment);
        }
    }

    return result;
}
