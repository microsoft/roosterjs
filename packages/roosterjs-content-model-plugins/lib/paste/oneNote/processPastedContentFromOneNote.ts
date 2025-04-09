import { setProcessor } from '../utils/setProcessor';
import {
    BeforePasteEvent,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

const OrderedListStyleMap = {
    1: 'decimal',
    a: 'lower-alpha',
    A: 'upper-alpha',
    i: 'lower-roman',
    I: 'upper-roman',
} as const;

/**
 * @internal
 */
export interface OneNoteListContext {
    listStyleType?: string;
    startNumberOverride?: number;
}

/**
 * @internal
 */
export interface OneNoteDomToModelContext extends DomToModelContext {
    oneNoteListContext?: OneNoteListContext;
}

export function processPastedContentFromOneNote(event: BeforePasteEvent): void {
    setProcessor(event.domToModelOption, 'ol', processOrderedList);
    setProcessor(event.domToModelOption, 'li', processListItem);
}

/**
 * @internal exported only for unit test
 */
export const processOrderedList: ElementProcessor<HTMLOListElement> = (
    group,
    element,
    cmContext
) => {
    const context = ensureOneNoteListContext(cmContext);

    if (context.oneNoteListContext) {
        const typeOfList = element.getAttribute('type');
        if (typeOfList) {
            const listStyle = OrderedListStyleMap[typeOfList as keyof typeof OrderedListStyleMap];
            const startNumberOverride = parseInt(element.getAttribute('start') || '1') || 1;

            context.oneNoteListContext.listStyleType = listStyle;
            context.oneNoteListContext.startNumberOverride = startNumberOverride;
        }
    }

    context.defaultElementProcessors.ol?.(group, element, context);
};

/**
 * @internal exported only for unit test
 */
export const processListItem: ElementProcessor<HTMLLIElement> = (group, element, cmContext) => {
    const context = ensureOneNoteListContext(cmContext);
    let removeStartNumberOverride = false;

    if (context.oneNoteListContext) {
        const { listStyleType, startNumberOverride } = context.oneNoteListContext;
        if (listStyleType) {
            const lastLevel = context.listFormat.levels[context.listFormat.levels.length - 1];
            lastLevel.format.listStyleType = listStyleType;

            if (startNumberOverride) {
                removeStartNumberOverride = true;
                lastLevel.format.startNumberOverride = startNumberOverride;

                delete context.oneNoteListContext.startNumberOverride;
            }
            delete context.oneNoteListContext.listStyleType;
        }
    }

    context.defaultElementProcessors.li?.(group, element, context);

    if (removeStartNumberOverride) {
        delete context.listFormat.levels[context.listFormat.levels.length - 1].format
            .startNumberOverride;
    }
};

function ensureOneNoteListContext(cmContext: DomToModelContext): OneNoteDomToModelContext {
    const context = cmContext as OneNoteDomToModelContext;

    if (!context.oneNoteListContext) {
        context.oneNoteListContext = {};
    }

    return context;
}
