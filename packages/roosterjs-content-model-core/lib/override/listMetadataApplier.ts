import {
    getObjectKeys,
    ListMetadataDefinition,
    OrderedListStyleMap,
    UnorderedListStyleMap,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
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

    for (const i of getObjectKeys(RomanValues)) {
        const timesRomanCharAppear = Math.floor(decimal / RomanValues[i]);
        decimal = decimal - timesRomanCharAppear * RomanValues[i];
        romanValue = romanValue + i.repeat(timesRomanCharAppear);
    }
    return isLowerCase ? romanValue.toLocaleLowerCase() : romanValue;
}

function shouldApplyToItem(listStyleType: string) {
    return listStyleType.indexOf('"') >= 0;
}

function getRawListStyleType(listType: 'OL' | 'UL', metadata: ListMetadataFormat, depth: number) {
    const { orderedStyleType, unorderedStyleType, applyListStyleFromLevel } = metadata;
    if (listType == 'OL') {
        return typeof orderedStyleType == 'number'
            ? OrderedListStyleMap[orderedStyleType]
            : applyListStyleFromLevel
            ? DefaultOrderedListStyles[depth % DefaultOrderedListStyles.length]
            : undefined;
    } else {
        return typeof unorderedStyleType == 'number'
            ? UnorderedListStyleMap[unorderedStyleType]
            : applyListStyleFromLevel
            ? DefaultUnorderedListStyles[depth % DefaultUnorderedListStyles.length]
            : undefined;
    }
}

/**
 * @internal
 */
export const listItemMetadataApplier: MetadataApplier<
    ListMetadataFormat,
    ContentModelListItemFormat
> = {
    metadataDefinition: ListMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getRawListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType) {
                if (shouldApplyToItem(listStyleType)) {
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
    metadataDefinition: ListMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getRawListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType) {
                if (!shouldApplyToItem(listStyleType)) {
                    format.listStyleType = listStyleType;
                } else {
                    delete format.listStyleType;
                }
            }
        }
    },
};
