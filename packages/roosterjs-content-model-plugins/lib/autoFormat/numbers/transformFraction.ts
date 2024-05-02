import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type {
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

const FRACTIONS: Record<string, string> = {
    '1/2': '½',
    '1/4': '¼',
    '3/4': '¾',
};

/**
 * @internal
 */
export function transformFraction(
    previousSegment: ContentModelText,
    paragraph: ContentModelParagraph,
    context: FormatContentModelContext
): boolean {
    const fraction = previousSegment.text.split(' ').pop()?.trim();
    if (fraction && FRACTIONS[fraction]) {
        const textLength = previousSegment.text.length - 1;
        const textIndex = textLength - fraction.length;
        const textSegment = splitTextSegment(previousSegment, paragraph, textIndex, textLength);
        textSegment.text = FRACTIONS[fraction];

        context.canUndoByBackspace = true;
        return true;
    }

    return false;
}
