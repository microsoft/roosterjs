import { splitTextSegment } from 'roosterjs-content-model-api';
import type {
    ContentModelText,
    FormatContentModelContext,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const FRACTIONS: Map<string, string> = new Map<string, string>([
    ['1/2', '½'],
    ['1/4', '¼'],
    ['3/4', '¾'],
]);

/**
 * @internal
 */
export function transformFraction(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
): boolean {
    const fraction = previousSegment.text.split(' ').pop()?.trim();
    const text = fraction ? FRACTIONS.get(fraction) : undefined;

    if (fraction && text) {
        const textLength = previousSegment.text.length - 1;
        const textIndex = textLength - fraction.length;
        const textSegment = splitTextSegment(previousSegment, paragraph, textIndex, textLength);
        textSegment.text = text;

        context.canUndoByBackspace = true;
        return true;
    }

    return false;
}
