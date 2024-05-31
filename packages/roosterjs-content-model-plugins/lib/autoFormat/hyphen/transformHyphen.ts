import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type {
    ContentModelText,
    FormatContentModelContext,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function transformHyphen(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
): boolean {
    const segments = previousSegment.text.split(' ');
    const dashes = segments[segments.length - 2];
    if (dashes === '--') {
        const textIndex = previousSegment.text.lastIndexOf('--');
        const textSegment = splitTextSegment(previousSegment, paragraph, textIndex, textIndex + 2);

        textSegment.text = textSegment.text.replace('--', '—');
        context.canUndoByBackspace = true;
        return true;
    } else {
        const text = segments.pop();
        const hasDashes = text && text?.indexOf('--') > -1;
        if (hasDashes && text.trim() !== '--') {
            const textIndex = previousSegment.text.indexOf(text);
            const textSegment = splitTextSegment(
                previousSegment,
                paragraph,
                textIndex,
                textIndex + text.length - 1
            );

            const textLength = textSegment.text.length;
            if (textSegment.text[0] !== '-' && textSegment.text[textLength - 1] !== '-') {
                textSegment.text = textSegment.text.replace('--', '—');
                context.canUndoByBackspace = true;
                return true;
            }
        }
    }
    return false;
}
