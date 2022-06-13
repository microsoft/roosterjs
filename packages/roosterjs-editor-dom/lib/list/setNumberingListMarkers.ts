import convertDecimalsToAlpha from './convertDecimalsToAlpha';
import convertDecimalsToRoman from './convertDecimalsToRomans';
import { NumberingListType } from 'roosterjs-editor-types';
import type { CompatibleNumberingListType } from 'roosterjs-editor-types/lib/compatibleTypes';

interface MarkerStyle {
    markerType: number;
    markerSeparator: string;
    markerSecondSeparator?: string;
    lowerCase?: boolean;
}

enum MarkerTypes {
    Decimal,
    Roman,
    Alpha,
}

/**
 * @internal
 * Set marker style of a numbering list
 * @param listStyleType
 * @param li
 */
export default function setNumberingListMarkers(
    li: HTMLLIElement,
    listStyleType: NumberingListType | CompatibleNumberingListType,
    level: number
) {
    const { markerSeparator, markerSecondSeparator, markerType, lowerCase } = numberingListStyle[
        listStyleType
    ];

    let markerNumber = level.toString();
    if (markerType === MarkerTypes.Roman) {
        markerNumber = convertDecimalsToRoman(level, lowerCase);
    } else if (markerType === MarkerTypes.Alpha) {
        markerNumber = convertDecimalsToAlpha(level - 1, lowerCase);
    }

    const marker = markerSecondSeparator
        ? markerSecondSeparator + markerNumber + markerSeparator
        : markerNumber + markerSeparator;

    li.style.listStyleType = `"${marker}"`;
}

const numberingListStyle: Record<string, MarkerStyle> = {
    [NumberingListType.Decimal]: {
        markerType: MarkerTypes.Decimal,
        markerSeparator: '. ',
    },
    [NumberingListType.DecimalDash]: {
        markerType: MarkerTypes.Decimal,
        markerSeparator: '- ',
    },
    [NumberingListType.DecimalParenthesis]: {
        markerType: MarkerTypes.Decimal,
        markerSeparator: ') ',
    },
    [NumberingListType.DecimalDoubleParenthesis]: {
        markerType: MarkerTypes.Decimal,
        markerSeparator: ') ',
        markerSecondSeparator: '(',
    },
    [NumberingListType.LowerAlpha]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: '. ',
        lowerCase: true,
    },
    [NumberingListType.LowerAlphaDash]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: '- ',
        lowerCase: true,
    },
    [NumberingListType.LowerAlphaParenthesis]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: ') ',
        lowerCase: true,
    },
    [NumberingListType.LowerAlphaDoubleParenthesis]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: ') ',
        markerSecondSeparator: '(',
        lowerCase: true,
    },
    [NumberingListType.UpperAlpha]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: '. ',
    },
    [NumberingListType.UpperAlphaDash]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: '- ',
    },
    [NumberingListType.UpperAlphaParenthesis]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: ') ',
    },
    [NumberingListType.UpperAlphaDoubleParenthesis]: {
        markerType: MarkerTypes.Alpha,
        markerSeparator: ') ',
        markerSecondSeparator: '(',
    },
    [NumberingListType.LowerRoman]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: '. ',
        lowerCase: true,
    },
    [NumberingListType.LowerRomanDash]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: '- ',
        lowerCase: true,
    },
    [NumberingListType.LowerRomanParenthesis]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: ') ',
        lowerCase: true,
    },
    [NumberingListType.LowerRomanDoubleParenthesis]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: ') ',
        markerSecondSeparator: '(',
        lowerCase: true,
    },
    [NumberingListType.UpperRoman]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: '. ',
    },
    [NumberingListType.UpperRomanDash]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: '- ',
    },
    [NumberingListType.UpperRomanParenthesis]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: ') ',
    },
    [NumberingListType.UpperRomanDoubleParenthesis]: {
        markerType: MarkerTypes.Roman,
        markerSeparator: ') ',
        markerSecondSeparator: '(',
    },
};
