import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type {
    ContentModelText,
    FormatContentModelContext,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const getOrdinal = (value: number) => {
    const ORDINALS: Record<number, string> = {
        1: 'st',
        2: 'nd',
        3: 'rd',
    };
    return ORDINALS[value] || 'th';
};

/**
 * @internal
 */
export function transformOrdinals(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
): boolean {
    const value = previousSegment.text.split(' ').pop()?.trim();
    if (value) {
        const ordinal = value.substring(value.length - 2);
        const ordinalValue = parseInt(value);
        if (ordinalValue && getOrdinal(ordinalValue) === ordinal) {
            const ordinalSegment = splitTextSegment(
                previousSegment,
                paragraph,
                previousSegment.text.length - 3,
                previousSegment.text.length - 1
            );

            ordinalSegment.format.superOrSubScriptSequence = 'super';
            context.canUndoByBackspace = true;
            return true;
        }
    }
    return false;
}
