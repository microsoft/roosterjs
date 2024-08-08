import { splitTextSegment } from 'roosterjs-content-model-api';
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
 * The two last characters of ordinal number (st, nd, rd, th)
 */
const ORDINAL_LENGTH = 2;

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
        const ordinal = value.substring(value.length - ORDINAL_LENGTH); // This value  is equal st, nd, rd, th
        const numericValue = getNumericValue(value); //This is the numeric part. Ex: 10th, numeric value = 10
        if (numericValue && getOrdinal(numericValue) === ordinal) {
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

function getNumericValue(text: string) {
    const number = text.substring(0, text.length - ORDINAL_LENGTH);
    const isNumber = /^-?\d+$/.test(number);
    if (isNumber) {
        return parseInt(text);
    }
    return null;
}
