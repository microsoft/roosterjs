import { BulletListType, ListType, NumberingListType } from 'roosterjs-editor-types';

const enum NumberingTypes {
    Decimal,
    LowerAlpha,
    UpperAlpha,
    LowerRoman,
    UpperRoman,
}

const enum Character {
    Dot,
    Dash,
    Parenthesis,
    DoubleParenthesis,
}

const characters: Record<string, number> = {
    '.': Character.Dot,
    '-': Character.Dash,
    ')': Character.Parenthesis,
    '(': Character.DoubleParenthesis,
};

const identifyCharacter = (text: string) => {
    const char = text[0] === '(' ? text[0] : text[text.length - 1];
    return characters[char];
};

const identifyNumberingType = (text: string) => {
    const char = text[0] === '(' ? text[1] : text[0];
    if (!isNaN(parseInt(char))) {
        return NumberingTypes.Decimal;
    } else if (/[a-z]+/g.test(char)) {
        if (char === 'i') {
            return NumberingTypes.LowerRoman;
        } else {
            return NumberingTypes.LowerAlpha;
        }
    } else if (/[A-Z]+/g.test(char)) {
        if (char === 'I') {
            return NumberingTypes.UpperRoman;
        } else {
            return NumberingTypes.UpperAlpha;
        }
    }
};

const numberingListTypes: Record<number, (char: number) => number> = {
    [NumberingTypes.Decimal]: char => DecimalsTypes[char],
    [NumberingTypes.LowerAlpha]: char => LowerAlphaTypes[char],
    [NumberingTypes.UpperAlpha]: char => UpperAlphaTypes[char],
    [NumberingTypes.LowerRoman]: char => LowerRomanTypes[char],
    [NumberingTypes.UpperRoman]: char => UpperRomanTypes[char],
};

const UpperRomanTypes: Record<number, number> = {
    [Character.Dot]: NumberingListType.UpperRoman,
    [Character.Dash]: NumberingListType.UpperRomanDash,
    [Character.Parenthesis]: NumberingListType.UpperRomanParenthesis,
    [Character.DoubleParenthesis]: NumberingListType.UpperRomanDoubleParenthesis,
};

const LowerRomanTypes: Record<number, number> = {
    [Character.Dot]: NumberingListType.LowerRoman,
    [Character.Dash]: NumberingListType.LowerRomanDash,
    [Character.Parenthesis]: NumberingListType.LowerRomanParenthesis,
    [Character.DoubleParenthesis]: NumberingListType.LowerRomanDoubleParenthesis,
};

const UpperAlphaTypes: Record<number, number> = {
    [Character.Dot]: NumberingListType.UpperAlpha,
    [Character.Dash]: NumberingListType.UpperAlphaDash,
    [Character.Parenthesis]: NumberingListType.UpperAlphaParenthesis,
    [Character.DoubleParenthesis]: NumberingListType.UpperAlphaDoubleParenthesis,
};

const LowerAlphaTypes: Record<number, number> = {
    [Character.Dot]: NumberingListType.LowerAlpha,
    [Character.Dash]: NumberingListType.LowerAlphaDash,
    [Character.Parenthesis]: NumberingListType.LowerAlphaParenthesis,
    [Character.DoubleParenthesis]: NumberingListType.LowerAlphaDoubleParenthesis,
};

const DecimalsTypes: Record<number, number> = {
    [Character.Dot]: NumberingListType.Decimal,
    [Character.Dash]: NumberingListType.DecimalDash,
    [Character.Parenthesis]: NumberingListType.DecimalParenthesis,
    [Character.DoubleParenthesis]: NumberingListType.DecimalDoubleParenthesis,
};

const bulletListType: Record<string, number> = {
    '*': BulletListType.Disc,
    '-': BulletListType.Dash,
    '--': BulletListType.Square,
    '->': BulletListType.LongArrow,
    '-->': BulletListType.LongArrow,
    '=>': BulletListType.UnfilledArrow,
    '>': BulletListType.ShortArrow,
};

const identifyNumberingListType = (textBeforeCursor: string): NumberingListType => {
    const numbering = textBeforeCursor.replace(/\s/g, '');
    const char = identifyCharacter(numbering);
    const numberingType = identifyNumberingType(numbering);
    return numberingListTypes[numberingType](char);
};

const identifyBulletListType = (textBeforeCursor: string): BulletListType => {
    const bullet = textBeforeCursor.replace(/\s/g, '');
    return bulletListType[bullet];
};

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @param listType The type of the list (ordered or unordered)
 * @returns the style of the list
 */
export default function getListStyle(
    textBeforeCursor: string,
    listType: ListType
): NumberingListType | BulletListType {
    if (listType === ListType.Ordered) {
        return identifyNumberingListType(textBeforeCursor);
    } else if (listType === ListType.Unordered) {
        return identifyBulletListType(textBeforeCursor);
    }
}
