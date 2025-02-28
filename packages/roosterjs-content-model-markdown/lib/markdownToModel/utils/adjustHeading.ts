import type {
    ContentModelParagraphDecorator,
    ContentModelText,
} from 'roosterjs-content-model-types';

const MarkdownHeadings: Record<string, string> = {
    h1: '# ',
    h2: '## ',
    h3: '### ',
    h4: '#### ',
    h5: '##### ',
    h6: '###### ',
};

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
