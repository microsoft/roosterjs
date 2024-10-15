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

const ORDINALS = ['st', 'nd', 'rd', 'th'];

/**
 * The two last characters of ordinal number (st, nd, rd, th)
 */
const ORDINAL_LENGTH = 2;

/**
 * @internal
 */ export function transformOrdinals(
    previousSegment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
): boolean {
    const value = previousSegment.text.split(' ').pop()?.trim();
    let shouldAddSuperScript = false;
    if (value) {
        const isOrdinal = ORDINALS.indexOf(value) > -1;
        if (isOrdinal) {
            const index = paragraph.segments.indexOf(previousSegment);
            const numberSegment = paragraph.segments[index - 1];
            let numericValue: number | null = null;
            if (
                numberSegment &&
                numberSegment.segmentType == 'Text' &&
                (numericValue = getNumericValue(numberSegment.text, true /* checkFullText */)) &&
                getOrdinal(numericValue) === value
            ) {
                shouldAddSuperScript = true;
            }
        } else {
            const ordinal = value.substring(value.length - ORDINAL_LENGTH); // This value  is equal st, nd, rd, th
            const numericValue = getNumericValue(value); //This is the numeric part. Ex: 10th, numeric value =
            if (numericValue && getOrdinal(numericValue) === ordinal) {
                shouldAddSuperScript = true;
            }
        }

        if (shouldAddSuperScript) {
            const ordinalSegment = splitTextSegment(
                previousSegment,
                paragraph,
                previousSegment.text.length - 3,
                previousSegment.text.length - 1
            );

            ordinalSegment.format.superOrSubScriptSequence = 'super';
            context.canUndoByBackspace = true;
        }
    }
    return shouldAddSuperScript;
}

function getNumericValue(text: string, checkFullText = false): number | null {
    const number = checkFullText ? text : text.substring(0, text.length - ORDINAL_LENGTH);
    const isNumber = /^-?\d+$/.test(number);
    if (isNumber) {
        return parseInt(text);
    }
    return null;
}
