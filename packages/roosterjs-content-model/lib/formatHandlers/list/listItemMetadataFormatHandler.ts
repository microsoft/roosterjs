import { FormatHandler } from '../FormatHandler';
import { getObjectKeys, getTagOfNode } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ListMetadataFormat } from '../../publicTypes/format/formatParts/ListMetadataFormat';
import { NodeType } from 'roosterjs-editor-types';
import { OrderedMap, UnorderedMap } from './listLevelMetadataFormatHandler';

const OrderedMapPlaceholderRegex = /\$\{(\w+)\}/;
const DefaultOrderedListStyles = ['decimal', 'lower-alpha', 'lower-roman'];
const DefaultUnorderedListStyles = ['disc', 'circle', 'square'];
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

/**
 * @internal
 */
export const listItemMetadataFormatHandler: FormatHandler<ListMetadataFormat> = {
    parse: () => {
        // TODO: Handle list style override
    },
    apply: (format, element, context) => {
        const parent = element.parentNode;
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0 && isNodeOfType(parent, NodeType.Element) && !parent.style.listStyleType) {
            const parentTag = getTagOfNode(parent);
            const style =
                parentTag == 'OL'
                    ? getOrderedListStyleValue(
                          OrderedMap[format.orderedStyleType!],
                          context.listFormat.threadItemCounts[depth]
                      ) ?? DefaultOrderedListStyles[depth % DefaultOrderedListStyles.length]
                    : UnorderedMap[format.unorderedStyleType!] ??
                      DefaultUnorderedListStyles[depth % DefaultUnorderedListStyles.length];

            if (style && (depth > 0 || (style != 'decimal' && style != 'disc'))) {
                element.style.listStyleType = style;
            }
        }
    },
};

/**
 * @internal
 * Export for test only
 */
export function getOrderedListStyleValue(
    template: string | undefined,
    listNumber: number
): string | undefined {
    return template
        ? template.replace(OrderedMapPlaceholderRegex, (match, subStr) => {
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
