import addParser from '../utils/addParser';
import ContentModelBeforePasteEvent from '../../../../publicTypes/event/ContentModelBeforePasteEvent';
import { ContentModelBlockGroup } from 'roosterjs-content-model/lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegmentFormat } from 'roosterjs-content-model/lib/publicTypes/format/ContentModelSegmentFormat';
import { DomToModelContext } from 'roosterjs-content-model/lib/publicTypes/context/DomToModelContext';
import { matchesSelector } from 'roosterjs-editor-dom';
import { setProcessor } from '../utils/setProcessor';

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';
const WORD_ONLINE_IDENTIFYING_SELECTOR =
    'div.ListContainerWrapper>ul[class^="BulletListStyle"],div.ListContainerWrapper>ol[class^="NumberListStyle"],span.WACImageContainer > img';
export const LIST_CONTAINER_ELEMENT_CLASS_NAME = 'ListContainerWrapper';
// const IMAGE_CONTAINER_ELEMENT_CLASS_NAME = 'WACImageContainer';

const EMPTY_TEXT_RUN = 'EmptyTextRun';
const END_OF_PARAGRAPH = 'EOP';

const CLASSES_TO_KEEP = [
    'BulletListStyle',
    'OutlineElement',
    'NumberListStyle',
    'WACImageContainer',
    'ListContainerWrapper',
    'BulletListStyle',
    END_OF_PARAGRAPH,
    EMPTY_TEXT_RUN,
];

const wacSubSuperParser = (
    format: ContentModelSegmentFormat,
    element: HTMLElement,
    context: DomToModelContext
): void => {
    const verticalAlign = element.style.verticalAlign;
    if (verticalAlign === 'super') {
        format.superOrSubScriptSequence = 'super';
    }
    if (verticalAlign === 'sub') {
        format.superOrSubScriptSequence = 'sub';
    }
};
const wacElementProcessor = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext
): void => {
    if (matchesSelector(element, WAC_IDENTIFY_SELECTOR)) {
        element.style.removeProperty('display');
        element.style.removeProperty('margin');
    }

    if (element.classList.contains(LIST_CONTAINER_ELEMENT_CLASS_NAME)) {
        context.elementProcessors.child(group, element, context);
        return;
    }

    if (
        element.classList.contains(END_OF_PARAGRAPH) &&
        element.previousElementSibling?.classList.contains(EMPTY_TEXT_RUN)
    ) {
        return;
    }

    context.defaultElementProcessors.element(group, element, context);
};
const wacLiElementProcessor = (
    group: ContentModelBlockGroup,
    element: HTMLLIElement,
    context: DomToModelContext
): void => {
    context.defaultElementProcessors.li?.(group, element, context);
    const { listFormat } = context;
    const listParent = listFormat.listParent;
    if (listParent) {
        const lastblock = listParent.blocks[listParent.blocks.length - 1];
        if (lastblock.blockType == 'BlockGroup' && lastblock.blockGroupType == 'ListItem') {
            const currentLevel = lastblock.levels[lastblock.levels.length - 1];

            lastblock.format.marginLeft;

            // Get item level from 'data-aria-level' attribute
            let level = parseInt(element.getAttribute('data-aria-level') ?? '');

            if (level > lastblock.levels.length) {
                while (level != lastblock.levels.length) {
                    lastblock.levels.push(currentLevel);
                }
            } else {
                lastblock.levels.splice(level, lastblock.levels.length - 1);
                lastblock.levels[level - 1] = currentLevel;
            }
        }
    }
};
/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev ContentModelBeforePasteEvent
 */
export function handleWacComponentsPaste(ev: ContentModelBeforePasteEvent) {
    ev.domToModelOption.allowCacheElement = false;
    addParser(ev.domToModelOption, 'segment', wacSubSuperParser);
    addParser(ev.domToModelOption, 'listItem', (format, element, context) => {
        if (element.style.display === 'block') {
            format.displayForDummyItem = undefined;
        }

        format.marginLeft = undefined;
    });
    addParser(ev.domToModelOption, 'block', (format, element, context) => {
        format.marginBottom = undefined;
        format.marginLeft = undefined;
        format.marginRight = undefined;
        format.marginTop = undefined;
    });
    setProcessor(ev.domToModelOption, 'element', wacElementProcessor);
    setProcessor(ev.domToModelOption, 'li', wacLiElementProcessor);
    ev.sanitizingOption.additionalAllowedCssClasses.push(...CLASSES_TO_KEEP);
}

/**
 * @internal
 */
export function isWordOnlineWithList(fragment: DocumentFragment): boolean {
    return !!(fragment && fragment.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR));
}
