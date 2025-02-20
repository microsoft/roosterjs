import { adjustHeading } from '../utils/adjustHeading';
import { applyLink } from './applyLink';
import { applyTextFormatting } from './applyTextFormatting';
import { createBr, createText } from 'roosterjs-content-model-dom';
import { createImageSegment } from '../creators/createImageSegment';
import { splitLinkAndImages } from '../utils/splitLinksAndImages';

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
        const textSegments = splitLinkAndImages(text);
        for (const segment of textSegments) {
            const formattedSegment = createText(segment);
            const image = createImageSegment(formattedSegment);
            if (image) {
                paragraph.segments.push(image);
            } else {
                adjustHeading(formattedSegment, decorator);
                applyLink(formattedSegment);
                const formattedSegments = applyTextFormatting(formattedSegment);
                paragraph.segments.push(...formattedSegments);
            }
        }
    }

    return paragraph;
}
