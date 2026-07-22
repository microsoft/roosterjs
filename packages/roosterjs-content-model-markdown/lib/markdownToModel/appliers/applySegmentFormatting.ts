import { adjustHeading } from '../utils/adjustHeading';
import { createBr } from 'roosterjs-content-model-dom';
import { parseInlineSegments } from '../utils/parseInlineSegments';

import type {
    ContentModelEntity,
    ContentModelParagraph,
    ContentModelParagraphDecorator,
    ContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applySegmentFormatting(
    text: string,
    paragraph: ContentModelParagraph,
    decorator?: ContentModelParagraphDecorator,
    mathDocument?: Document,
    entities?: ContentModelEntity[]
): ContentModelParagraph | undefined {
    if (text.length === 0) {
        const br = createBr();
        paragraph.segments.push(br);
    } else {
        const segments: ContentModelSegment[] = [];
        parseInlineSegments(
            text,
            segments,
            undefined /*state*/,
            undefined /*link*/,
            mathDocument,
            entities
        );

        // Apply heading adjustment to the first text-bearing segment, if any.
        let headingAdjusted = false;
        for (const segment of segments) {
            if (!headingAdjusted && segment.segmentType === 'Text') {
                const adjusted = adjustHeading(segment, decorator);
                headingAdjusted = true;
                if (!adjusted) {
                    continue;
                }
            }
            paragraph.segments.push(segment);
        }
    }

    return paragraph;
}
