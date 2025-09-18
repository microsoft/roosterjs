import { segmentsWithSameFormat } from './areSameSegments';
import type {
    ContentModelText,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Find continuous text segments that have the same format and decorators, merge them, So we can reduce total count of segments
 * @param block The parent paragraph to check.
 */
export function mergeTextSegments(block: ShallowMutableContentModelParagraph) {
    let lastText: ContentModelText | null = null;

    for (let i = 0; i < block.segments.length; i++) {
        const segment = block.segments[i];

        if (segment.segmentType != 'Text') {
            lastText = null;
        } else if (!lastText || !segmentsWithSameFormat(lastText, segment)) {
            lastText = segment;
        } else {
            lastText.text += segment.text;
            block.segments.splice(i, 1);
            i--;
        }
    }
}
