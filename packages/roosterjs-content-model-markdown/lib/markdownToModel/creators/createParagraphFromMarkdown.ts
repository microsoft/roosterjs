import { applySegmentFormatting } from '../appliers/applySegmentFormatting';
import { createParagraph } from 'roosterjs-content-model-dom';
import { getHeadingDecorator } from '../utils/getHeadingDecorator';
import type { MarkdownToModelOptions } from '../types/MarkdownToModelOptions';
import type { ContentModelParagraph } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createParagraphFromMarkdown(
    text: string,
    options: MarkdownToModelOptions
): ContentModelParagraph {
    const paragraph = createParagraph(
        undefined /* isImplicit */,
        options.direction ? { direction: options.direction } : undefined
    );

    const headingType = getHeadingDecorator(text);
    if (headingType) {
        paragraph.decorator = headingType;
    }
    applySegmentFormatting(text, paragraph, headingType);
    return paragraph;
}
