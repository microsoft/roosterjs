import { addParser } from '../utils/addParser';
import { createListLevel, parseFormat } from 'roosterjs-content-model-dom';
import { setProcessor } from '../utils/setProcessor';
import {
    COMMENT_HIGHLIGHT_CLASS,
    COMMENT_HIGHLIGHT_CLICKED_CLASS,
    LIST_CONTAINER_ELEMENT_CLASS_NAME,
    REMOVE_MARGIN_ELEMENTS,
    TEMP_ELEMENTS_CLASSES,
} from './constants';
import type {
    BeforePasteEvent,
    ContentModelBlockFormat,
    ContentModelBlockGroup,
    ContentModelListItem,
    ContentModelListItemLevelFormat,
    ContentModelListLevel,
    ContentModelSegmentFormat,
    DomToModelContext,
    DomToModelListFormat,
    ElementProcessor,
    FormatParser,
    PaddingFormat,
} from 'roosterjs-content-model-types';

const LIST_ELEMENT_TAGS = ['UL', 'OL', 'LI'];
const LIST_ELEMENT_SELECTOR = LIST_ELEMENT_TAGS.join(',');
const END_OF_PARAGRAPH = 'EOP';
const SELECTED_CLASS = 'Selected';
const BASE_PADDING_WAC_LISTS = '1em';

interface WacContext extends DomToModelListFormat {
    /**
     * Current list levels
     */
    currentListLevels?: ContentModelListLevel[];
    /**
     * Array to keep the start of the lists and determine if the start override should be set.
     */
    listItemThread?: number[];
    /**
     * Outline counters must survive intervening paragraphs and unrelated lists.
     */
    headingNumbers?: Map<string, number[]>;
}

/**
 * Wac components do not use sub and super tags, instead only add vertical align to a span.
 * This parser normalize the content for content model
 */
const wacSubSuperParser: FormatParser<ContentModelSegmentFormat> = (
    format: ContentModelSegmentFormat,
    element: HTMLElement
): void => {
    const verticalAlign = element.style.verticalAlign;
    if (verticalAlign === 'super') {
        format.superOrSubScriptSequence = 'super';
    }
    if (verticalAlign === 'sub') {
        format.superOrSubScriptSequence = 'sub';
    }
    if (
        (verticalAlign === 'super' || verticalAlign === 'sub') &&
        element.style.fontSize !== 'smaller'
    ) {
        format.superOrSubScriptFontSize = 'inherit';
    }
};

/**
 * This processor does:
 * 1) Remove the display and margin of the element.
 * 2) When an element should be ignored but should handle the child elements call the default child processor.
 * 3) Removes selected End of Paragraph markers unless they are the paragraph's only content.
 * 4) Finally call the default processor.
 * @returns
 */
const wacElementProcessor: ElementProcessor<HTMLElement> = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext
): void => {
    const elementTag = element.tagName;

    if (element.matches(REMOVE_MARGIN_ELEMENTS)) {
        element.style.removeProperty('display');
        element.style.removeProperty('margin');
    }

    if (element.classList.contains(LIST_CONTAINER_ELEMENT_CLASS_NAME)) {
        context.elementProcessors.child(group, element, context);
        return;
    }

    if (TEMP_ELEMENTS_CLASSES.some(className => element.classList.contains(className))) {
        return;
    }

    if (
        element.classList.contains(SELECTED_CLASS) &&
        element.classList.contains(END_OF_PARAGRAPH)
    ) {
        const lastBlock = group.blocks[group.blocks.length - 1];

        if (lastBlock?.blockType != 'Paragraph' || lastBlock.segments.length > 0) {
            return;
        }

        element.style.removeProperty('background-color');
        element.style.removeProperty('border-color');
    }

    if (shouldClearListContext(elementTag, element, context)) {
        const { listFormat } = context;
        listFormat.levels = [];
        listFormat.listParent = undefined;
    }

    context.defaultElementProcessors.element(group, element, context);
};

/**
 * This processor calls the default list processor and then sets the correct list level and list bullet.
 */
const wacLiElementProcessor: ElementProcessor<HTMLLIElement> = (
    group: ContentModelBlockGroup,
    element: HTMLLIElement,
    context: DomToModelContext
): void => {
    const level = parseInt(element.getAttribute('data-aria-level') ?? '');
    const listFormat = context.listFormat as WacContext;
    const listType =
        listFormat.levels[context.listFormat.levels.length - 1]?.listType ||
        (element.closest('ol,ul')?.tagName.toUpperCase() as 'UL' | 'OL');
    const newLevel: ContentModelListLevel = createListLevel(listType, context.blockFormat);
    parseFormat(element, context.formatParsers.listLevelThread, newLevel.format, context);
    parseFormat(element, context.formatParsers.listLevel, newLevel.format, context);
    context.listFormat.levels = listFormat.currentListLevels || context.listFormat.levels;

    if (level > 0) {
        if (level > context.listFormat.levels.length) {
            while (level != context.listFormat.levels.length) {
                context.listFormat.levels.push(newLevel);
            }
        } else {
            context.listFormat.levels.splice(level, context.listFormat.levels.length - 1);
            context.listFormat.levels[level - 1] = newLevel;
        }
    }

    context.defaultElementProcessors.li?.(group, element, context);

    const listParent = listFormat.listParent;
    if (listParent) {
        const lastblock = listParent.blocks[listParent.blocks.length - 1];
        if (lastblock.blockType == 'BlockGroup' && lastblock.blockGroupType == 'ListItem') {
            const currentLevel = lastblock.levels[lastblock.levels.length - 1];
            updateStartOverride(currentLevel, element, context);
            updateHeading(lastblock, element, context);
        }
    }

    const newLevels: ContentModelListLevel[] = [];
    listFormat.levels.forEach(v => {
        const newValue: ContentModelListLevel = {
            dataset: { ...v.dataset },
            format: { ...v.format },
            listType: v.listType,
        };
        newLevels.push(newValue);
    });
    listFormat.currentListLevels = newLevels;
    listFormat.levels = [];
};

/**
 * This parsers does:
 * 1) Sets the display for dummy item to undefined when the current style is block.
 * 2) Removes the Margin Left
 */
const wacListItemParser: FormatParser<ContentModelListItemLevelFormat> = (
    format: ContentModelListItemLevelFormat,
    element: HTMLElement
): void => {
    if (element.style.display === 'block') {
        format.displayForDummyItem = undefined;
    }
};

/**
 * Wac usually adds padding to lists which is unwanted so remove it.
 */
const wacListLevelParser: FormatParser<ContentModelListItemLevelFormat> = (
    format: ContentModelListItemLevelFormat
): void => {
    format.marginLeft = undefined;
    format.paddingLeft = BASE_PADDING_WAC_LISTS;
};

const wacTableCellPaddingParser: FormatParser<PaddingFormat> = (format, element) => {
    const keys: (keyof PaddingFormat)[] = [
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
    ];
    keys.forEach(key => {
        if (element.style[key]) {
            format[key] = element.style[key];
        }
    });
};

/**
 * This function returns whether we need to clear the list format.
 * Word Online wraps lists inside divs to have this structure:
 *
 *  <div class='ListContainerWrapper'>
 *      <ol>...</ol>
 *  </div>
 *  <div>
 *      <p>...</p>
 *  <div>
 *  <div class='ListContainerWrapper'>
 *      <ol>...</ol>
 *  </div>
 *
 *  So if a elements is not contained inside of a list we should clear the list context to prevent normal text to be
 *  transformed into list
 *  For the above scenario, if we do not clear the format, the content inside of the second div would be transformed to a list too.
 */
function shouldClearListContext(
    elementTag: string,
    element: HTMLElement,
    context: DomToModelContext
) {
    return (
        context.listFormat.levels.length > 0 &&
        LIST_ELEMENT_TAGS.every(tag => tag != elementTag) &&
        !element.closest(LIST_ELEMENT_SELECTOR)
    );
}

const wacCommentParser: FormatParser<ContentModelSegmentFormat> = (
    format: ContentModelSegmentFormat,
    element: HTMLElement
): void => {
    if (
        element.className.includes(COMMENT_HIGHLIGHT_CLASS) ||
        element.className.includes(COMMENT_HIGHLIGHT_CLICKED_CLASS)
    ) {
        delete format.backgroundColor;
    }
};
/**
 * @internal
 * Convert pasted content from Office Online
 * Once it is known that the document is from WAC
 * We need to remove the display property and margin from all the list item
 * @param ev BeforePasteEvent
 */
export function processPastedContentWacComponents(ev: BeforePasteEvent) {
    addParser(ev.domToModelOption, 'segment', wacSubSuperParser);
    addParser(ev.domToModelOption, 'listItemThread', wacListItemParser);
    addParser(ev.domToModelOption, 'listItemElement', wacListItemParser);
    addParser(ev.domToModelOption, 'listLevel', wacListLevelParser);
    addParser(ev.domToModelOption, 'container', wacContainerParser);
    addParser(ev.domToModelOption, 'table', wacContainerParser);
    addParser(ev.domToModelOption, 'tableCell', wacTableCellPaddingParser);
    addParser(ev.domToModelOption, 'segment', wacCommentParser);

    setProcessor(ev.domToModelOption, 'element', wacElementProcessor);
    setProcessor(ev.domToModelOption, 'li', wacLiElementProcessor);
}

const wacContainerParser: FormatParser<ContentModelBlockFormat> = (
    format: ContentModelBlockFormat,
    element: HTMLElement
) => {
    if (element.style.marginLeft.startsWith('-')) {
        delete format.marginLeft;
    }
};

function updateHeading(
    listItem: ContentModelListItem,
    element: HTMLLIElement,
    context: DomToModelContext
) {
    const paragraph = element.querySelector('p');
    const styleName = paragraph
        ?.querySelector('[data-ccp-parastyle]')
        ?.getAttribute('data-ccp-parastyle');
    const list = element.closest('ol');

    if (!paragraph || !list || !/^heading [1-6]$/i.test(styleName || '')) {
        return;
    }

    const headingParagraph = listItem.blocks.find(
        block => block.blockType == 'Paragraph' && block.decorator?.tagName == 'p'
    );
    if (headingParagraph?.blockType == 'Paragraph') {
        // An inside marker and a block paragraph would occupy separate lines.
        Object.assign(listItem.format, headingParagraph.format);
        headingParagraph.isImplicit = true;
        headingParagraph.format = {};
        delete headingParagraph.decorator;
    }

    listItem.levels.forEach(level => {
        level.format.paddingLeft = '0px';
        level.format.paddingRight = '0px';
        level.format.marginTop = '0px';
        level.format.marginBottom = '0px';
    });
    listItem.format.marginLeft = '0px';
    listItem.format.marginRight = '0px';
    listItem.format.listStylePosition = 'inside';
    parseFormat(
        paragraph,
        context.formatParsers.segmentOnBlock,
        listItem.formatHolder.format,
        context
    );

    const listId = element.getAttribute('data-listid');
    const template = element.getAttribute('data-leveltext');
    const [start, level] = extractWordListMetadata(list, element);

    if (
        !listId ||
        !template ||
        !/^%[1-9](?:\.%[1-9])*[.)]?$/.test(template) ||
        !(level > 0 && level <= 9) ||
        !Number.isFinite(start)
    ) {
        return;
    }

    const listFormat = context.listFormat as WacContext;
    const headings = (listFormat.headingNumbers = listFormat.headingNumbers || new Map());
    const numbers = headings.get(listId) || [];
    numbers[level - 1] = start;
    numbers.length = level;
    headings.set(listId, numbers);

    let complete = true;
    const label = template.replace(/%([1-9])/g, (_match, index: string) => {
        const number = numbers[parseInt(index) - 1];
        complete = complete && number !== undefined;
        return number === undefined ? '' : number.toString();
    });
    if (complete) {
        listItem.format.listStyleType = '"' + label + ' "';
    }
}

function updateStartOverride(
    currentLevel: ContentModelListLevel | undefined,
    element: HTMLLIElement,
    ctx: DomToModelContext
) {
    if (!currentLevel || currentLevel.listType == 'UL') {
        return;
    }

    const list = element.closest('ol');
    const listFormat = ctx.listFormat as WacContext;
    const [start, listLevel] = extractWordListMetadata(list, element);

    if (!listFormat.listItemThread) {
        listFormat.listItemThread = [];
    }

    const thread: number | undefined = listFormat.listItemThread[listLevel];
    if (thread && start - thread != 1) {
        currentLevel.format.startNumberOverride = start;
    }
    listFormat.listItemThread[listLevel] = start;
}
function extractWordListMetadata(
    list: HTMLElement | null | undefined,
    item: HTMLElement | null | undefined
) {
    const itemIndex =
        item && Array.from(list?.querySelectorAll('li') || []).indexOf(item as HTMLLIElement);
    const start =
        parseInt(list?.getAttribute('start') || '1') + (itemIndex && itemIndex > 0 ? itemIndex : 0);
    const listLevel = parseInt(item?.getAttribute('data-aria-level') || '');

    return [start, listLevel];
}
