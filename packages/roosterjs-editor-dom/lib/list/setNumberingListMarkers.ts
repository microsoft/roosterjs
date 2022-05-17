import { NumberingListType } from 'roosterjs-editor-types/lib';
import { VListItem } from '..';

interface NumberingCSSStyle {
    listStyle: string;
    marker: string;
    className: string;
}

/**
 * @internal
 * Set marker style of a numbering list
 * @param listStyleType
 * @param li
 */
export default function setNumberingListMarkers(
    listStyleType: NumberingListType,
    li: VListItem,
    rootLi: HTMLLIElement
) {
    const { marker } = numberingListStyle[listStyleType];
    rootLi.style.listStyleType = `${li.getNode()}${marker}`;
}

const numberingListStyle: Record<string, NumberingCSSStyle> = {
    [NumberingListType.Decimal]: {
        listStyle: 'decimal',
        marker: '. ',
        className: 'Decimal',
    },
    [NumberingListType.DecimalDash]: {
        listStyle: 'decimal',
        marker: '- ',
        className: 'DecimalDash',
    },
    [NumberingListType.DecimalParenthesis]: {
        listStyle: 'decimal',
        marker: ') ',
        className: 'DecimalParenthesis',
    },
    [NumberingListType.LowerAlpha]: {
        listStyle: 'lower-alpha',
        marker: '. ',
        className: 'LowerAlpha',
    },
    [NumberingListType.LowerAlphaDash]: {
        listStyle: 'lower-alpha',
        marker: '- ',
        className: 'LowerAlphaDash',
    },
    [NumberingListType.LowerAlphaParenthesis]: {
        listStyle: 'lower-alpha',
        marker: ') ',
        className: 'LowerAlphaParenthesis',
    },
    [NumberingListType.UpperAlpha]: {
        listStyle: 'upper-alpha',
        marker: '. ',
        className: 'UpperAlpha',
    },
    [NumberingListType.UpperAlphaDash]: {
        listStyle: 'upper-alpha',
        marker: '- ',
        className: 'UpperAlphaDash',
    },
    [NumberingListType.UpperAlphaParenthesis]: {
        listStyle: 'upper-alpha',
        marker: ') ',
        className: 'UpperAlphaParenthesis',
    },
    [NumberingListType.LowerRoman]: {
        listStyle: 'lower-roman',
        marker: '. ',
        className: 'LowerRoman',
    },
    [NumberingListType.LowerRomanDash]: {
        listStyle: 'lower-roman',
        marker: '- ',
        className: 'LowerRomanDash',
    },
    [NumberingListType.LowerRomanParenthesis]: {
        listStyle: 'lower-roman',
        marker: ') ',
        className: 'LowerRomanParenthesis',
    },
    [NumberingListType.UpperRoman]: {
        listStyle: 'upper-roman',
        marker: '. ',
        className: 'UpperRoman',
    },
    [NumberingListType.UpperRomanDash]: {
        listStyle: 'upper-roman',
        marker: '- ',
        className: 'UpperRomanDash',
    },
    [NumberingListType.UpperRomanParenthesis]: {
        listStyle: 'upper-roman',
        marker: ') ',
        className: 'UpperRomanParenthesis',
    },
};
