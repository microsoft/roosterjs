import { MarkdownHeadings } from '../../constants/headings';
import type {
    ContentModelParagraphDecorator,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustHeading(
    textSegment: ContentModelText,
    decorator?: ContentModelParagraphDecorator
): ContentModelText {
    const markdownToBeRemoved = MarkdownHeadings[decorator?.tagName || ''];
    if (markdownToBeRemoved) {
        textSegment.text = textSegment.text.replace(markdownToBeRemoved, '');
    }
    return textSegment;
}
