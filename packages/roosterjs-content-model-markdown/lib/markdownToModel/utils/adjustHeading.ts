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
): ContentModelText | null {
    console.log(textSegment);
    const markdownToBeRemoved = MarkdownHeadings[decorator?.tagName || ''];
    if (markdownToBeRemoved) {
        textSegment.text = textSegment.text.replace(markdownToBeRemoved, '');
        if (textSegment.text.length === 0) {
            // If the text becomes empty after removing the heading markdown, we can remove the segment
            return null;
        }
    }
    return textSegment;
}
