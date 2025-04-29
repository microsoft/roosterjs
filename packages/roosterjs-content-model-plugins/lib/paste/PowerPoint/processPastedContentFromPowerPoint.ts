import { addParser } from '../utils/addParser';
import { processAsListItem, setupListFormat } from '../utils/customListUtils';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import {
    BulletListType,
    getOrderedListNumberStr,
    moveChildNodes,
    NumberingListType,
} from 'roosterjs-content-model-dom';
import type {
    BeforePasteEvent,
    ContentModelListItemLevelFormat,
    DOMCreator,
} from 'roosterjs-content-model-types';

const BulletSelector = '* > span > span[style*=mso-special-format]';
const MsOfficeSpecialFormat = 'mso-special-format';
const CssStyleKey = 'style';
const MsoSpecialFormatRegex = /mso-special-format:\s*([^;]*)/;

const clearListItemStyles = (format: ContentModelListItemLevelFormat): void => {
    delete format.textAlign;
    delete format.marginLeft;
    delete format.paddingLeft;
};
/**
 * @internal
 * Convert pasted content from PowerPoint
 * @param event The BeforePaste event
 */

export function processPastedContentFromPowerPoint(
    event: BeforePasteEvent,
    domCreator: DOMCreator
) {
    const { fragment, clipboardData, domToModelOption } = event;

    if (clipboardData.html && !clipboardData.text && clipboardData.image) {
        // It is possible that PowerPoint copied both image and HTML but not plain text.
        // We always prefer HTML if any.
        const doc = domCreator.htmlToDOM(clipboardData.html);

        moveChildNodes(fragment, doc?.body);
    }

    addParser(domToModelOption, 'block', removeNegativeTextIndentParser);

    setProcessor(domToModelOption, 'element', (group, element, context) => {
        const style = element.getAttribute(CssStyleKey) || '';
        // If the element is the bullet element, just ignore it, otherwise we will see an extra bullet in the list
        if (style.includes(MsOfficeSpecialFormat) && context.listFormat.levels.length > 0) {
            return;
        }
        const bulletElement = element.querySelector(BulletSelector) as HTMLElement;
        if (bulletElement) {
            const {
                depth,
                unorderedBulletType,
                orderedBulletType,
                startNumberOverrideOrBullet,
                isOrderedList,
                isNewList,
            } = extractPowerPointListInfo(element, bulletElement);

            // Setup the listformat with the metadata extracted from the bullet element
            setupListFormat(
                isOrderedList ? 'OL' : 'UL',
                element,
                context,
                depth,
                context.listFormat,
                group,
                [clearListItemStyles]
            );

            // Set the metadata for the list item, which will be used to set the correct bullet style type
            const listMetadata = {
                unorderedStyleType:
                    !isOrderedList && unorderedBulletType
                        ? BulletListType[unorderedBulletType]
                        : undefined,
                orderedStyleType:
                    isOrderedList && orderedBulletType
                        ? NumberingListType[orderedBulletType]
                        : undefined,
            };

            // Process the Div element as a list item.
            processAsListItem(context, element, group, listMetadata, listItem => {
                const currentMarkerSize = listItem.formatHolder.format.fontSize;
                const bulletElementSize = bulletElement.parentElement?.style.fontSize;
                listItem.formatHolder.format.fontSize = bulletElementSize || currentMarkerSize;
                if (isNewList) {
                    listItem.levels[
                        listItem.levels.length - 1
                    ].format.startNumberOverride = parseInt(startNumberOverrideOrBullet);
                }
                clearListItemStyles(listItem.levels[listItem.levels.length - 1].format);
                clearListItemStyles(listItem.format);
            });
        } else {
            context.defaultElementProcessors.element?.(group, element, context);
        }
    });
}

/**
 * Extract list information from PowerPoint pasted content
 *
 * The lists from PowerPoint are represent as:
 *
 * - The class 0# represents the depth of the list, if the list is in the first level, the class attribute wont be present.
 * - The mso-special-format style represents the type of bullet and the start of the list.
 *      The first part of the mso-special-format is the type of bullet, and the second part is the start of the list.
 *  - All the items that are in the same list have the same mso-special-format style. Which we are leveraging to identify when a list is new or part of the existing list thread.
 *
 * @example
 *  `   <div class="O1" style="...">
            <span style="font-size: 5pt"
                ><span style="mso-special-format: 'numbullet6\,1'; font-family: +mj-lt"
                    >i.</span
                ></span
            ><span style="...;">123</span>
        </div> `
 *
 * @param element The element to extract list information from
 * @param bulletElement The bullet element to extract list information from
 * @returns The extracted list information
 */
function extractPowerPointListInfo(element: HTMLElement, bulletElement: HTMLElement) {
    const className = element.className.substring(1) || '0';
    const depth = parseInt(className) + 1;
    const style = bulletElement.getAttribute(CssStyleKey) || '';
    const msoSpecialFormat = style.match(MsoSpecialFormatRegex);
    const [bulletTypeHtml, startNumberOverrideOrBullet] =
        msoSpecialFormat?.[1].replace('"', '').split('\\,') || [];
    const isOrderedList = OrderedListStyleMap.has(bulletTypeHtml);

    const unorderedBulletType = UnorderedBullets.get(bulletElement.innerText);
    const orderedBulletType = OrderedListStyleMap.get(bulletTypeHtml);

    return {
        depth,
        unorderedBulletType,
        orderedBulletType,
        startNumberOverrideOrBullet,
        isOrderedList,
        isNewList:
            isOrderedList &&
            !!orderedBulletType &&
            bulletElement.innerText ===
                getPptListStart(orderedBulletType, startNumberOverrideOrBullet),
    };
}

const UnorderedBullets: Map<string, keyof typeof BulletListType> = new Map([
    ['•', 'Disc'],
    ['o', 'Circle'],
    ['§', 'Square'],
    ['q', 'BoxShadow'],
    ['v', 'Xrhombus'],
    ['Ø', 'ShortArrow'],
    ['ü', 'CheckMark'],
]);

const OrderedListStyleMap: Map<string, keyof typeof NumberingListType> = new Map([
    ['numbullet1', 'UpperAlpha'],
    ['numbullet2', 'DecimalParenthesis'],
    ['numbullet3', 'Decimal'],
    ['numbullet7', 'UpperRoman'],
    ['numbullet9', 'LowerAlphaParenthesis'],
    ['numbullet0', 'LowerAlpha'],
    ['numbullet6', 'LowerRoman'],
]);

function getPptListStart(
    orderedBulletType: keyof typeof NumberingListType,
    startNumberOverride: string
) {
    const bullet = getOrderedListNumberStr(
        NumberingListType[orderedBulletType],
        parseInt(startNumberOverride)
    );
    switch (orderedBulletType) {
        case 'Decimal':
        case 'UpperAlpha':
        case 'LowerAlpha':
        case 'UpperRoman':
        case 'LowerRoman':
            return bullet + '.';
        case 'DecimalParenthesis':
        case 'LowerAlphaParenthesis':
            return bullet + ')';

        default:
            return undefined;
    }
}
