import { getObjectKeys } from '../../domUtils/getObjectKeys';
import { NumberingListType } from '../../constants/NumberingListType';

const CharCodeOfA = 65;
const RomanValues: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
};

/**
 * Get the list number for a list item according to list style type and its index number
 * @param styleType The list style number, should be a value of NumberingListType type
 * @param listNumber List number, start from 1
 * @returns A string for this list item. For example, when pass in NumberingListType.LowerAlpha and 2, it returns "b"
 */
export function getOrderedListNumberStr(styleType: number, listNumber: number): string {
    switch (styleType) {
        case NumberingListType.LowerAlpha:
        case NumberingListType.LowerAlphaDash:
        case NumberingListType.LowerAlphaDoubleParenthesis:
        case NumberingListType.LowerAlphaParenthesis:
            return convertDecimalsToAlpha(listNumber, true /*isLowerCase*/);

        case NumberingListType.UpperAlpha:
        case NumberingListType.UpperAlphaDash:
        case NumberingListType.UpperAlphaDoubleParenthesis:
        case NumberingListType.UpperAlphaParenthesis:
            return convertDecimalsToAlpha(listNumber, false /*isLowerCase*/);

        case NumberingListType.LowerRoman:
        case NumberingListType.LowerRomanDash:
        case NumberingListType.LowerRomanDoubleParenthesis:
        case NumberingListType.LowerRomanParenthesis:
            return convertDecimalsToRoman(listNumber, true /*isLowerCase*/);

        case NumberingListType.UpperRoman:
        case NumberingListType.UpperRomanDash:
        case NumberingListType.UpperRomanDoubleParenthesis:
        case NumberingListType.UpperRomanParenthesis:
            return convertDecimalsToRoman(listNumber, false /*isLowerCase*/);

        default:
            return listNumber + '';
    }
}

function convertDecimalsToAlpha(decimal: number, isLowerCase?: boolean): string {
    let alpha = '';
    decimal--;

    while (decimal >= 0) {
        alpha = String.fromCharCode((decimal % 26) + CharCodeOfA) + alpha;
        decimal = Math.floor(decimal / 26) - 1;
    }
    return isLowerCase ? alpha.toLowerCase() : alpha;
}

function convertDecimalsToRoman(decimal: number, isLowerCase?: boolean) {
    let romanValue = '';

    for (const i of getObjectKeys(RomanValues)) {
        const timesRomanCharAppear = Math.floor(decimal / RomanValues[i]);
        decimal = decimal - timesRomanCharAppear * RomanValues[i];
        romanValue = romanValue + i.repeat(timesRomanCharAppear);
    }
    return isLowerCase ? romanValue.toLocaleLowerCase() : romanValue;
}
