import { NumberingListType } from './NumberingListType';

/**
 * Style map for ordered list
 */
export const OrderedListStyleMap: Record<number, string> = {
    [NumberingListType.Decimal]: 'decimal',
    [NumberingListType.DecimalDash]: '"${Number}- "',
    [NumberingListType.DecimalParenthesis]: '"${Number}) "',
    [NumberingListType.DecimalDoubleParenthesis]: '"(${Number}) "',
    [NumberingListType.LowerAlpha]: 'lower-alpha',
    [NumberingListType.LowerAlphaDash]: '"${LowerAlpha}- "',
    [NumberingListType.LowerAlphaParenthesis]: '"${LowerAlpha}) "',
    [NumberingListType.LowerAlphaDoubleParenthesis]: '"(${LowerAlpha}) "',
    [NumberingListType.UpperAlpha]: 'upper-alpha',
    [NumberingListType.UpperAlphaDash]: '"${UpperAlpha}- "',
    [NumberingListType.UpperAlphaParenthesis]: '"${UpperAlpha}) "',
    [NumberingListType.UpperAlphaDoubleParenthesis]: '"(${UpperAlpha}) "',
    [NumberingListType.LowerRoman]: 'lower-roman',
    [NumberingListType.LowerRomanDash]: '"${LowerRoman}- "',
    [NumberingListType.LowerRomanParenthesis]: '"${LowerRoman}) "',
    [NumberingListType.LowerRomanDoubleParenthesis]: '"(${LowerRoman}) "',
    [NumberingListType.UpperRoman]: 'upper-roman',
    [NumberingListType.UpperRomanDash]: '"${UpperRoman}- "',
    [NumberingListType.UpperRomanParenthesis]: '"${UpperRoman}) "',
    [NumberingListType.UpperRomanDoubleParenthesis]: '"(${UpperRoman}) "',
};
