import { addParser } from '../utils/addParser';
import { BulletListType, moveChildNodes, NumberingListType } from 'roosterjs-content-model-dom';
import { processAsListItem, setupListFormat } from '../utils/customListUtils';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import type {
    BeforePasteEvent,
    ContentModelListLevel,
    DOMCreator,
    DomToModelContext,
} from 'roosterjs-content-model-types';

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
    addParser(domToModelOption, 'listItemElement', format => {
        delete format.textAlign;
        delete format.marginLeft;
        delete format.paddingLeft;
    });
    addParser(domToModelOption, 'listLevel', format => {
        delete format.paddingLeft;
    });

    const eles = Array.from(
        fragment.querySelectorAll('* > span > span[style*=mso-special-format]')
    ) as HTMLElement[];
    console.log('eles', eles);

    console.log(
        'levels',
        eles
            .map(e => {
                const parent = e.parentElement?.parentElement;
                const className = parent?.className.substring(1) || '0';
                const style = e.getAttribute('style') || '';
                const msoSpecialFormat = style.match(/mso-special-format:\s*([^;]*)/);
                const [bulletType, startNumberOverride] =
                    msoSpecialFormat?.[1].replace('"', '').split('\\,') || [];
                return {
                    depth: parseInt(className) + 1,
                    bulletType: bulletType,
                    startNumberOverride: parseInt(startNumberOverride),
                    bullet: e.innerText,
                };
            })
            .filter(
                (e, index, array) => index === array.findIndex(t => t.bulletType === e.bulletType)
            )
    );
    setProcessor(domToModelOption, 'element', (group, element, context) => {
        const style = element.getAttribute('style') || '';
        if (style.includes('mso-special-format') && context.listFormat.levels.length > 0) {
            return;
        }
        const bulletElement = element.querySelector('* > span > span[style*=mso-special-format]');
        if (bulletElement && ensurePowerPointListContext(context) && context.pptListFormat) {
            const {
                depth,
                bulletType,
                startNumberOverrideOrBullet,
                isOrderedList,
            } = extractPowerPointListInfo(element);

            context.pptListFormat.listDepth = depth;
            context.pptListFormat.startOverride = parseInt(startNumberOverrideOrBullet);
            context.pptListFormat.markerType = bulletType;
            context.pptListFormat.isOrderedList = isOrderedList;

            setupListFormat(
                isOrderedList ? 'OL' : 'UL',
                element,
                context,
                depth,
                context.listFormat,
                group,
                [
                    format => {
                        delete (format as any).display;
                        delete format.paddingLeft;
                        delete format.textAlign;
                        delete format.marginTop;
                        delete format.marginBottom;
                    },
                ]
            );

            const unorderedBullet = UnorderedBullets.get(bulletType);
            const orderedBullet = OrderedListStyleMap.get(bulletType);
            const listMetadata = {
                unorderedStyleType:
                    !isOrderedList && unorderedBullet ? BulletListType[unorderedBullet] : undefined,
                orderedStyleType:
                    isOrderedList && orderedBullet ? NumberingListType[orderedBullet] : undefined,
            };

            processAsListItem(context, element, group, listMetadata);
        } else {
            context.defaultElementProcessors.element?.(group, element, context);
        }
    });
}

function extractPowerPointListInfo(element: HTMLElement) {
    const className = element.className.substring(1) || '0';
    const depth = parseInt(className) + 1;
    const style = element.getAttribute('style') || '';
    const msoSpecialFormat = style.match(/mso-special-format:\s*([^;]*)/);
    const [bulletType, startNumberOverrideOrBullet] =
        msoSpecialFormat?.[1].replace('"', '').split('\\,') || [];
    const isOrderedList = OrderedListStyleMap.has(bulletType);

    return { depth, bulletType, startNumberOverrideOrBullet, isOrderedList };
}

interface PowerPointListContext extends DomToModelContext {
    pptListFormat?: {
        listDepth?: number;
        previousListLevels?: ContentModelListLevel[];
        startOverride?: number;
        markerType?: string;
        isOrderedList?: boolean;
    };
}

function ensurePowerPointListContext(context: DomToModelContext): context is PowerPointListContext {
    const listContext = context as PowerPointListContext;
    if (!listContext.pptListFormat) {
        listContext.pptListFormat = {};
    }
    return true;
}

export const UnorderedBullets: Map<string, keyof typeof BulletListType> = new Map([
    ['•', 'Disc'],
    ['o', 'Circle'],
    ['§', 'Square'],
    ['q', 'Square'],
    ['v', 'Disc'],
    ['Ø', 'ShortArrow'],
    ['ü', 'Disc'],
]);

const OrderedListStyleMap: Map<string, keyof typeof NumberingListType> = new Map([
    ['numbullet3', 'Decimal'],
    ['numbullet2', 'DecimalParenthesis'],
    ['numbullet7', 'UpperRoman'],
    ['numbullet1', 'UpperAlpha'],
    ['numbullet9', 'LowerAlphaParenthesis'],
    ['numbullet0', 'LowerAlpha'],
    ['numbullet6', 'LowerRoman'],
]);

// function processAsListItem(
//     context: PowerPointListContext,
//     element: HTMLElement,
//     group: ContentModelBlockGroup
// ) {
//     const listFormat = context.listFormat
//     const listLevel = listFormat.levels[listFormat.levels.length - 1];
//     const { listType } = listLevel;

//     if (bullet) {
//         updateListMetadata(listFormat.levels[listFormat.levels.length - 1], metadata =>
//             Object.assign({}, metadata, {
//                 unorderedStyleType: listType == 'UL' ? bullet : undefined,
//                 orderedStyleType: listType == 'OL' ? bullet : undefined,
//             })
//         );
//     }

//     const listItem = createListItem(listFormat.levels, context.segmentFormat);

//     parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);
//     parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);
//     parseFormat(element, customPptListParsers, listItem.format, context);

//     if (listType == 'OL') {
//         // setStartNumber(listItem, context, listMetadata);
//     }

//     context.elementProcessors.child(listItem, element, context);
//     addBlock(group, listItem);
// }
