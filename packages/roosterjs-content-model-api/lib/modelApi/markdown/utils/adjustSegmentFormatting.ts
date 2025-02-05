import { applyHeading } from './applyHeading';
import { applyLink } from './applyLink';
import { createBr, createText } from 'roosterjs-content-model-dom';
import { splitLinkAndImages } from './splitLinksAndImages';
import { transformImage } from './transformImage';
import type {
    ContentModelParagraph,
    ContentModelParagraphDecorator,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustSegmentFormatting(
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
            const image = transformImage(formattedSegment);
            if (image) {
                paragraph.segments.push(image);
            } else {
                applyHeading(formattedSegment, decorator);
                applyLink(formattedSegment);
                paragraph.segments.push(formattedSegment);
            }
        }
    }

    return paragraph;
}
