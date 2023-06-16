import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { FormatHandler } from '../FormatHandler';
import { getObjectKeys, getTagOfNode, safeInstanceOf } from 'roosterjs-editor-dom';
import { ListMetadataFormat } from '../../publicTypes/format/formatParts/ListMetadataFormat';

/**
 * @internal
 */
export const OrderedMap: Record<NumberingListType, string> = {
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

/**
 * @internal
 */
export const UnorderedMap: Record<BulletListType, string> = {
    [BulletListType.Disc]: 'disc',
    [BulletListType.Square]: '"∎ "',
    [BulletListType.Circle]: 'circle',
    [BulletListType.Dash]: '"- "',
    [BulletListType.LongArrow]: '"➔ "',
    [BulletListType.DoubleLongArrow]: '"➔ "',
    [BulletListType.ShortArrow]: '"➢ "',
    [BulletListType.UnfilledArrow]: '"➪ "',
    [BulletListType.Hyphen]: '"— "',
};

const OLTypeToStyleMap: Record<string, string> = {
    '1': 'decimal',
    a: 'lower-alpha',
    A: 'upper-alpha',
    i: 'lower-roman',
    I: 'upper-roman',
};

/**
 * @internal
 */
export const listLevelMetadataFormatHandler: FormatHandler<ListMetadataFormat> = {
    parse: (format, element) => {
        const listStyle =
            element.style.listStyleType ||
            (safeInstanceOf(element, 'HTMLOListElement') && OLTypeToStyleMap[element.type]);
        const tag = getTagOfNode(element);

        if (listStyle) {
            if (tag == 'OL' && format.orderedStyleType === undefined) {
                const value = getKeyFromValue(OrderedMap, listStyle);
                format.orderedStyleType =
                    typeof value === 'undefined' ? undefined : parseInt(value);
            } else if (tag == 'UL' && format.unorderedStyleType === undefined) {
                const value = getKeyFromValue(UnorderedMap, listStyle);
                format.unorderedStyleType =
                    typeof value === 'undefined' ? undefined : parseInt(value);
            }
        }
    },
    apply: (format, element) => {
        const tag = getTagOfNode(element);
        const listType =
            tag == 'OL'
                ? OrderedMap[format.orderedStyleType!]
                : UnorderedMap[format.unorderedStyleType!];

        if (listType && listType.indexOf('"') < 0) {
            element.style.listStyleType = listType;
        }
    },
};

function getKeyFromValue<K extends string | number, V>(
    map: Record<K, V>,
    value: V | undefined
): string | undefined {
    const result =
        value === undefined ? undefined : getObjectKeys(map).filter(key => map[key] == value)[0];

    // During run time the key is always string
    return (result as any) as string | undefined;
}
