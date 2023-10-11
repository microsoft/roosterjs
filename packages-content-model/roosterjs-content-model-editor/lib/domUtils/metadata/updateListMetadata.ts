import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { createNumberDefinition, createObjectDefinition } from './definitionCreators';
import { getObjectKeys, updateMetadata } from 'roosterjs-content-model-dom';
import type {
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    ContentModelWithDataset,
    ListMetadataFormat,
    MetadataApplier,
} from 'roosterjs-content-model-types';

const DefaultOrderedListStyles = ['decimal', 'lower-alpha', 'lower-roman'];
const DefaultUnorderedListStyles = ['disc', 'circle', 'square'];
const OrderedMapPlaceholderRegex = /\$\{(\w+)\}/;
const CharCodeOfA = 65;
const RomanValues: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
};
const OrderedMap: Record<NumberingListType, string> = {
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
const UnorderedMap: Record<BulletListType, string> = {
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

function getOrderedListStyleValue(
    template: string | undefined,
    listNumber: number
): string | undefined {
    return template
        ? template.replace(OrderedMapPlaceholderRegex, (_, subStr) => {
              switch (subStr) {
                  case 'Number':
                      return listNumber + '';
                  case 'LowerAlpha':
                      return convertDecimalsToAlpha(listNumber, true /*isLowerCase*/);
                  case 'UpperAlpha':
                      return convertDecimalsToAlpha(listNumber, false /*isLowerCase*/);
                  case 'LowerRoman':
                      return convertDecimalsToRoman(listNumber, true /*isLowerCase*/);
                  case 'UpperRoman':
                      return convertDecimalsToRoman(listNumber, false /*isLowerCase*/);
              }

              return '';
          })
        : undefined;
}

function convertDecimalsToAlpha(decimal: number, isLowerCase?: boolean): string {
    let alpha = '';
    decimal--;

    while (decimal >= 0) {
        alpha = String.fromCharCode((decimal % 26) + CharCodeOfA) + alpha;
        decimal = Math.floor(decimal / 26) - 1;
    }
    return isLowerCase ? alpha.toLowerCase() : alpha;
}

function convertDecimalsToRoman(decimal: number, isLowerCase?: boolean) {
    let romanValue = '';
    for (let i of getObjectKeys(RomanValues)) {
        let timesRomanCharAppear = Math.floor(decimal / RomanValues[i]);
        decimal = decimal - timesRomanCharAppear * RomanValues[i];
        romanValue = romanValue + i.repeat(timesRomanCharAppear);
    }
    return isLowerCase ? romanValue.toLocaleLowerCase() : romanValue;
}

const listMetadataDefinition = createObjectDefinition<ListMetadataFormat>(
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
    },
    true /** isOptional */,
    true /** allowNull */
);

function shouldApplyToItem(listStyleType: string) {
    return listStyleType.indexOf('"') >= 0;
}

function getRawListStyleType(listType: 'OL' | 'UL', metadata: ListMetadataFormat, depth: number) {
    const { orderedStyleType, unorderedStyleType } = metadata;
    if (listType == 'OL') {
        return orderedStyleType === undefined
            ? DefaultOrderedListStyles[depth % DefaultOrderedListStyles.length]
            : OrderedMap[orderedStyleType];
    } else {
        return unorderedStyleType === undefined
            ? DefaultUnorderedListStyles[depth % DefaultUnorderedListStyles.length]
            : UnorderedMap[unorderedStyleType];
    }
}

/**
 * @internal
 */
export const listItemMetadataApplier: MetadataApplier<
    ListMetadataFormat,
    ContentModelListItemFormat
> = {
    metadataDefinition: listMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getRawListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType && shouldApplyToItem(listStyleType)) {
                format.listStyleType =
                    listType == 'OL'
                        ? getOrderedListStyleValue(
                              listStyleType,
                              context.listFormat.threadItemCounts[depth]
                          )
                        : listStyleType;
            } else {
                delete format.listStyleType;
            }
        }
    },
};

/**
 * @internal
 */
export const listLevelMetadataApplier: MetadataApplier<
    ListMetadataFormat,
    ContentModelListItemLevelFormat
> = {
    metadataDefinition: listMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getRawListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType && !shouldApplyToItem(listStyleType)) {
                format.listStyleType = listStyleType;
            } else {
                delete format.listStyleType;
            }
        }
    },
};

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
