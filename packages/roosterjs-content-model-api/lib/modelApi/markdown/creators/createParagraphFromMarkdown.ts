import { adjustSegmentFormatting } from '../utils/adjustSegmentFormatting';
import { createParagraph } from 'roosterjs-content-model-dom';
import { getHeadingDecorator } from '../utils/getHeadingDecorator';
import type { ContentModelParagraph } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createParagraphFromMarkdown(text: string): ContentModelParagraph {
    const paragraph = createParagraph();
    const headingType = getHeadingDecorator(text);
    paragraph.decorator = headingType;
    adjustSegmentFormatting(text, paragraph, headingType);
    return paragraph;
}
