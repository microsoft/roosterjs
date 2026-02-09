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
    ContentModelListItemLevelFormat,
    ContentModelListLevel,
    ContentModelSegmentFormat,
    DomToModelContext,
    DomToModelListFormat,
    ElementProcessor,
    FormatParser,
} from 'roosterjs-content-model-types';

const LIST_ELEMENT_TAGS = ['UL', 'OL', 'LI'];
const LIST_ELEMENT_SELECTOR = LIST_ELEMENT_TAGS.join(',');
const END_OF_PARAGRAPH = 'EOP';
const SELECTED_CLASS = 'Selected';

interface WacContext extends DomToModelListFormat {
    /**
     * Current list levels
     */
    currentListLevels?: ContentModelListLevel[];
    /**
     * Array to keep the start of the lists and determine if the start override should be set.
     */
    listItemThread?: number[];
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
};

/**
 * This processor does:
 * 1) Remove the display and margin of the element.
 * 2) When an element should be ignored but should handle the child elements call the default child processor.
 * 3) Removes the End of Paragraph element to avoid empty lines, we should only remove this if the previous element of the EOP is an EmptyTextRun
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

    if (
        TEMP_ELEMENTS_CLASSES.some(className => element.classList.contains(className)) ||
        // This is needed to remove some temporary End of paragraph elements that WAC sometimes preserves
        (element.classList.contains(SELECTED_CLASS) && element.classList.contains(END_OF_PARAGRAPH))
    ) {
        return;
    } else if (shouldClearListContext(elementTag, element, context)) {
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

    format.marginLeft = undefined;
    format.marginRight = undefined;
};

/**
 * Wac usually adds padding to lists which is unwanted so remove it.
 */
const wacListLevelParser: FormatParser<ContentModelListItemLevelFormat> = (
    format: ContentModelListItemLevelFormat
): void => {
    format.marginLeft = undefined;
    format.paddingLeft = undefined;
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
