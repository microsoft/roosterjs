import { BulletListType, ListType, NumberingListType } from 'roosterjs-editor-types';

/**
 * @internal
 * The type and style of a list
 */

const enum NumberingTypes {
    Decimal = 1,
    LowerAlpha = 2,
    UpperAlpha = 3,
    LowerRoman = 4,
    UpperRoman = 5,
}

const enum Character {
    Dot = 1,
    Dash = 2,
    Parenthesis = 3,
    DoubleParenthesis = 4,
}

const characters: Record<string, number> = {
    '.': Character.Dot,
    '-': Character.Dash,
    ')': Character.Parenthesis,
    '(': Character.DoubleParenthesis,
};

const identifyCharacter = (text: string) => {
    return characters[text];
};

const identifyNumberingType = (text: string) => {
    if (!isNaN(parseInt(text))) {
        return NumberingTypes.Decimal;
    } else if (/[a-z]+/g.test(text)) {
        if (text === 'i') {
            return NumberingTypes.LowerRoman;
        } else {
            return NumberingTypes.LowerAlpha;
        }
    } else if (/[A-Z]+/g.test(text)) {
        if (text === 'I') {
            return NumberingTypes.UpperRoman;
        } else {
            return NumberingTypes.UpperAlpha;
        }
    }
};

const numberingListTypes: Record<number, (char: number) => number | null> = {
    [NumberingTypes.Decimal]: char => DecimalsTypes[char] || null,
    [NumberingTypes.LowerAlpha]: char => LowerAlphaTypes[char] || null,
    [NumberingTypes.UpperAlpha]: char => UpperAlphaTypes[char] || null,
    [NumberingTypes.LowerRoman]: char => LowerRomanTypes[char] || null,
    [NumberingTypes.UpperRoman]: char => UpperRomanTypes[char] || null,
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
    '—': BulletListType.Hyphen,
};

const identifyNumberingListType = (numbering: string): NumberingListType | null => {
    const separator = numbering.length === 2 ? numbering[1] : numbering[0];
    const char = identifyCharacter(separator);
    // if separator is not valid, no need to check if the number is valid.
    if (char) {
        const number = numbering.length === 2 ? numbering[0] : numbering[1];
        const numberingType = identifyNumberingType(number);
        return char && numberingType ? numberingListTypes[numberingType](char) : null;
    }
    return null;
};

const identifyBulletListType = (bullet: string): BulletListType | null => {
    return bulletListType[bullet] || null;
};

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @param listType The type of the list (ordered or unordered)
 * @returns The style of a list triggered by a string
 */
export default function getAutoListStyle(
    textBeforeCursor: string,
    listType: ListType
): NumberingListType | BulletListType {
    const trigger = textBeforeCursor.replace(/\s/g, '');
    if (listType == ListType.Unordered) {
        const bulletType = identifyBulletListType(trigger);
        return bulletType;
    }

    if (listType == ListType.Ordered) {
        // the marker must be a combination of 2 or 3 characters, so if the length is less than 2, no need to check
        const numberingType = trigger.length > 1 ? identifyNumberingListType(trigger) : null;
        return numberingType;
    }
}
