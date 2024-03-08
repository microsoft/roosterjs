import { BulletListType } from '../../constants/BulletListType';
import { NumberingListType } from '../../constants/NumberingListType';
import { updateMetadata } from 'roosterjs-content-model-dom';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
} from './definitionCreators';
import type { ContentModelWithDataset, ListMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Metadata definition of list
 */
export const listMetadataDefinition = createObjectDefinition<ListMetadataFormat>(
    {
        orderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            NumberingListType.Min,
            NumberingListType.Max
        ),
        unorderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            BulletListType.Min,
            BulletListType.Max
        ),
        applyListStyleFromLevel: createBooleanDefinition(true /*isOptional*/),
    },
    true /** isOptional */,
    true /** allowNull */
);

/**
 * Update list metadata with a callback
 * @param list The list Content Model (metadata holder)
 * @param callback The callback function used for updating metadata
 */
export function updateListMetadata(
    list: ContentModelWithDataset<ListMetadataFormat>,
    callback?: (format: ListMetadataFormat | null) => ListMetadataFormat | null
): ListMetadataFormat | null {
    return updateMetadata(list, callback, listMetadataDefinition);
}

export const OrderedMap: Record<number, string> = {
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
export const UnorderedMap: Record<number, string> = {
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
