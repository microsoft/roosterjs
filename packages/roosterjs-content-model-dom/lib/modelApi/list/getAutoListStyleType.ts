import { BulletListType } from '../../constants/BulletListType';
import { NumberingListType } from '../../constants/NumberingListType';
import type { ListMetadataFormat } from 'roosterjs-content-model-types';

const DefaultOrderedListStyles = [
    NumberingListType.Decimal,
    NumberingListType.LowerAlpha,
    NumberingListType.LowerRoman,
];
const DefaultUnorderedListStyles = [
    BulletListType.Disc,
    BulletListType.Circle,
    BulletListType.Square,
];
const OrderedListStyleRevertMap: Record<string, number> = {
    'lower-alpha': NumberingListType.LowerAlpha,
    'lower-latin': NumberingListType.LowerAlpha,
    'upper-alpha': NumberingListType.UpperAlpha,
    'upper-latin': NumberingListType.UpperAlpha,
    'lower-roman': NumberingListType.LowerRoman,
    'upper-roman': NumberingListType.UpperRoman,
};
const UnorderedListStyleRevertMap: Record<string, number> = {
    disc: BulletListType.Disc,
    circle: BulletListType.Circle,
    square: BulletListType.Square,
};

/**
 * Get automatic list style of a list item according to its lis type and metadata.
 * @param listType The list type, either OL or UL
 * @param metadata Metadata of this list item from list item model
 * @param depth Depth of list level, start from 0
 * @param existingStyleType Existing list style type in format, if any
 * @returns A number to represent list style type.
 * This will be the value of either NumberingListType (when listType is OL) or BulletListType (when listType is UL).
 * When there is a specified list style in its metadata, return this value, otherwise
 * When specified "applyListStyleFromLevel" in metadata, calculate auto list type from its depth, otherwise
 * When there is already listStyleType in list level format, find a related style type index, otherwise
 * return undefined
 */
export function getAutoListStyleType(
    listType: 'OL' | 'UL',
    metadata: ListMetadataFormat,
    depth: number,
    existingStyleType?: string
): number | undefined {
    const { orderedStyleType, unorderedStyleType, applyListStyleFromLevel } = metadata;
    if (listType == 'OL') {
        return typeof orderedStyleType == 'number'
            ? orderedStyleType
            : applyListStyleFromLevel
            ? DefaultOrderedListStyles[depth % DefaultOrderedListStyles.length]
            : existingStyleType
            ? OrderedListStyleRevertMap[existingStyleType]
            : undefined;
    } else {
        return typeof unorderedStyleType == 'number'
            ? unorderedStyleType
            : applyListStyleFromLevel
            ? DefaultUnorderedListStyles[depth % DefaultUnorderedListStyles.length]
            : existingStyleType
            ? UnorderedListStyleRevertMap[existingStyleType]
            : undefined;
    }
}
