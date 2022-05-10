import { BulletListType, ListType, NumberingListType } from 'roosterjs-editor-types/lib';

const identifyNumberingListType = (textBeforeCursor: string): NumberingListType => {
    const numbering = textBeforeCursor.replace(/\s/g, '');
    switch (numbering) {
        case '1.':
            return NumberingListType.Decimal;
        case '1-':
            return NumberingListType.DecimalDash;
        case '1)':
            return NumberingListType.DecimalParenthesis;
        case 'a.':
            return NumberingListType.LowerAlpha;
        case 'a)':
            return NumberingListType.LowerAlphaParenthesis;
        case 'a-':
            return NumberingListType.LowerAlphaDash;
        case 'A.':
            return NumberingListType.UpperAlpha;
        case 'A)':
            return NumberingListType.UpperAlphaParenthesis;
        case 'A-':
            return NumberingListType.UpperAlphaDash;
        case 'i.':
            return NumberingListType.LowerRoman;
        case 'i)':
            return NumberingListType.LowerRomanParenthesis;
        case 'i-':
            return NumberingListType.LowerRomanDash;
        case 'I.':
            return NumberingListType.UpperRoman;
        case 'I) ':
            return NumberingListType.UpperRomanParenthesis;
        case 'I-':
            return NumberingListType.UpperRomanDash;
        default:
            return null;
    }
};

const identifyBulletListType = (textBeforeCursor: string): BulletListType => {
    const bullet = textBeforeCursor.replace(/\s/g, '');
    switch (bullet) {
        case '*':
            return BulletListType.Disc;
        case '-':
            return BulletListType.Dash;
        case '--':
            return BulletListType.Square;
        case '>':
            return BulletListType.ShortArrow;
        case '->':
        case '-->':
            return BulletListType.LongArrow;
        case '=>':
            return BulletListType.UnfilledArrow;
        default:
            return null;
    }
};

export function getListStyle(
    textBeforeCursor: string,
    listType: ListType
): NumberingListType | BulletListType {
    if (listType === ListType.Ordered) {
        return identifyNumberingListType(textBeforeCursor);
    } else {
        return identifyBulletListType(textBeforeCursor);
    }
}
