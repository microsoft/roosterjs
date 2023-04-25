import ContentModelBeforePasteEvent from '../../../publicTypes/event/ContentModelBeforePasteEvent';
import { matchesSelector } from 'roosterjs-editor-dom';

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';
const WORD_ONLINE_IDENTIFYING_SELECTOR =
    'div.ListContainerWrapper>ul[class^="BulletListStyle"],div.ListContainerWrapper>ol[class^="NumberListStyle"],span.WACImageContainer > img';
export const LIST_CONTAINER_ELEMENT_CLASS_NAME = 'ListContainerWrapper';
const IMAGE_CONTAINER_ELEMENT_CLASS_NAME = 'WACImageContainer';

export function handleWacComponents(ev: ContentModelBeforePasteEvent) {
    if (!ev.domToModelOption.additionalFormatParsers) {
        ev.domToModelOption.additionalFormatParsers = {};
        ev.domToModelOption.additionalFormatParsers.segment = [];
    }
    if (!ev.domToModelOption.processorOverride) {
        ev.domToModelOption.processorOverride = {};
    }

    ev.domToModelOption.additionalFormatParsers.segment!.push((format, element, context) => {
        const verticalAlign = element.style.verticalAlign;
        if (verticalAlign === 'super') {
            format.superOrSubScriptSequence = 'super';
        }
        if (verticalAlign === 'sub') {
            format.superOrSubScriptSequence = 'sub';
        }
    });

    ev.domToModelOption.processorOverride.element = (group, element, context) => {
        if (matchesSelector(element, WAC_IDENTIFY_SELECTOR)) {
            element.style.removeProperty('display');
            element.style.removeProperty('margin');
        }
        if (element.classList.contains(LIST_CONTAINER_ELEMENT_CLASS_NAME)) {
            context.elementProcessors.child(group, element, context);
            return;
        }

        if (element.parentElement?.classList.contains(IMAGE_CONTAINER_ELEMENT_CLASS_NAME)) {
            return;
        }

        context.defaultElementProcessors.element(group, element, context);
    };

    ev.domToModelOption.processorOverride.li = (group, element, context) => {
        context.defaultElementProcessors.li?.(group, element, context);
        const { listFormat } = context;
        const listParent = listFormat.listParent;
        if (listParent) {
            const lastblock = listParent.blocks[listParent.blocks.length - 1];
            if (lastblock.blockType == 'BlockGroup' && lastblock.blockGroupType == 'ListItem') {
                const currentLevel = lastblock.levels[lastblock.levels.length - 1];

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
}

/**
 * @internal
 */
export function isWordOnlineWithList(fragment: DocumentFragment): boolean {
    return !!(fragment && fragment.querySelector(WORD_ONLINE_IDENTIFYING_SELECTOR));
}
