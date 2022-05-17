import { BulletListType, ListType, NumberingListType } from 'roosterjs-editor-types/lib';

const numberingListTypes: Record<string, number> = {
    '1.': NumberingListType.Decimal,
    '1-': NumberingListType.DecimalDash,
    '1)': NumberingListType.DecimalParenthesis,
    'a.': NumberingListType.LowerAlpha,
    'a)': NumberingListType.LowerAlphaParenthesis,
    'a-': NumberingListType.LowerAlphaDash,
    'A.': NumberingListType.UpperAlpha,
    'A)': NumberingListType.UpperAlphaParenthesis,
    'A-': NumberingListType.UpperAlphaDash,
    'i.': NumberingListType.LowerRoman,
    'i)': NumberingListType.LowerRomanParenthesis,
    'i-': NumberingListType.LowerRomanDash,
    'I.': NumberingListType.UpperRoman,
    'I)': NumberingListType.UpperRomanParenthesis,
    'I-': NumberingListType.UpperRomanDash,
};

const bulletListType: Record<string, number> = {
    '*': BulletListType.Disc,
    '-': BulletListType.Dash,
    '--': BulletListType.Square,
    '>': BulletListType.ShortArrow,
    '->': BulletListType.LongArrow,
    '-->': BulletListType.LongArrow,
    '=>': BulletListType.UnfilledArrow,
};

const identifyNumberingListType = (textBeforeCursor: string): NumberingListType => {
    const numbering = textBeforeCursor.replace(/\s/g, '');
    return numberingListTypes[numbering] || null;
};

const identifyBulletListType = (textBeforeCursor: string): BulletListType => {
    const bullet = textBeforeCursor.replace(/\s/g, '');
    return bulletListType[bullet] || null;
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
