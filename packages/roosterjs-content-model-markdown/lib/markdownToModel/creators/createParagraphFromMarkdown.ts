import { applySegmentFormatting } from '../appliers/applySegmentFormatting';
import { createParagraph } from 'roosterjs-content-model-dom';
import { getHeadingDecorator } from '../utils/getHeadingDecorator';

import type { ContentModelParagraph } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createParagraphFromMarkdown(text: string): ContentModelParagraph {
    const paragraph = createParagraph();
    const headingType = getHeadingDecorator(text);
    if (headingType) {
        paragraph.decorator = headingType;
    }
    applySegmentFormatting(text, paragraph, headingType);
    return paragraph;
}
