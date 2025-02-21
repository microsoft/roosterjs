import { adjustHeading } from '../utils/adjustHeading';
import { applyLink } from './applyLink';
import { applyTextFormatting } from './applyTextFormatting';
import { createBr, createText } from 'roosterjs-content-model-dom';
import { createImageSegment } from '../creators/createImageSegment';
import { splitParagraphSegments } from '../utils/splitParagraphSegments';

import type {
    ContentModelParagraph,
    ContentModelParagraphDecorator,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applySegmentFormatting(
    text: string,
    paragraph: ContentModelParagraph,
    decorator?: ContentModelParagraphDecorator
): ContentModelParagraph | undefined {
    if (text.length === 0) {
        const br = createBr();
        paragraph.segments.push(br);
    } else {
        const textSegments = splitParagraphSegments(text);
        for (const segment of textSegments) {
            const formattedSegment = createText(segment.text);
            switch (segment.type) {
                case 'image':
                    const image = createImageSegment(segment.text, segment.url);
                    paragraph.segments.push(image);
                    break;
                case 'link':
                    applyLink(formattedSegment, segment.text, segment.url);
                case 'text':
                    adjustHeading(formattedSegment, decorator);
                    const formattedSegments = applyTextFormatting(formattedSegment);
                    paragraph.segments.push(...formattedSegments);
                    break;
            }
        }
    }

    return paragraph;
}
