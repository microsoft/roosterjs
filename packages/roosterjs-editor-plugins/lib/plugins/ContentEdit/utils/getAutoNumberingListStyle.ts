import { NumberingListType } from 'roosterjs-editor-types';
import { VListChain } from 'roosterjs-editor-dom';

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
};

const numberingTriggers = ['1', 'a', 'A', 'I', 'i'];

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

const identifyNumberingListType = (
    numbering: string,
    isDoubleParenthesis: boolean
): NumberingListType | null => {
    const separatorCharacter = isDoubleParenthesis
        ? Character.DoubleParenthesis
        : characters[numbering[1]];
    // if separator is not valid, no need to check if the number is valid.
    if (separatorCharacter) {
        const number = numbering[numbering.length - 2];
        const numberingType = identifyNumberingType(number);
        return numberingType ? numberingListTypes[numberingType](separatorCharacter) : null;
    }
    return null;
};

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @param previousListChain (Optional) This parameters is used to keep the list chain, if the is not a new list
 * @returns The style of a numbering list triggered by a string
 */
export default function getAutoNumberingListStyle(
    textBeforeCursor: string,
    previousListChain?: VListChain[]
): NumberingListType {
    const trigger = textBeforeCursor.trim();
    //Only the staring items ['1', 'a', 'A', 'I', 'i'] must trigger a new list. All the other triggers is used to keep the list chain.
    //The index is always the character before the last character
    const listIndex = trigger[trigger.length - 2];
    const index = parseInt(listIndex);

    if (previousListChain && index > 1) {
        if (
            (previousListChain.length < 1 && numberingTriggers.indexOf(listIndex) < 0) ||
            (previousListChain?.length > 0 &&
                !previousListChain[previousListChain.length - 1]?.canAppendAtCursor(index))
        ) {
            return null;
        }
    }

    // the marker must be a combination of 2 or 3 characters, so if the length is less than 2, no need to check
    // If the marker length is 3, the marker style is double parenthesis such as (1), (A).
    const isDoubleParenthesis = trigger.length === 3 && trigger[0] === '(' && trigger[2] === ')';
    const numberingType =
        trigger.length === 2 || isDoubleParenthesis
            ? identifyNumberingListType(trigger, isDoubleParenthesis)
            : null;
    return numberingType;
}
