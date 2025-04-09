import { setProcessor } from '../utils/setProcessor';
import type {
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

const UnorderedListStyleMap = {
    disc: 'disc',
    circle: 'circle',
    square: 'square',
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

/**
 * @internal
 * Processes the content pasted from OneNote by setting up custom processors
 * for ordered lists (`<ol>`) and list items (`<li>`). These processors handle
 * specific list styles and numbering overrides that may be present in OneNote
 * content.
 *
 * @param event - The `BeforePasteEvent` containing the DOM-to-model options
 * and other context information for the paste operation.
 */
export function processPastedContentFromOneNote(event: BeforePasteEvent): void {
    setProcessor(event.domToModelOption, 'ol', processOrderedList);
    setProcessor(event.domToModelOption, 'ul', processUnorderedList);
    setProcessor(event.domToModelOption, 'li', processListItem);
}

/**
 * @internal exported only for unit test
 * Content from OneNote may have ordered lists with specific styles and start numbers.
 * This function processes the `<ol>` elements, extracting the `type` and `start` custom attributes
 * to set the appropriate list style and starting number in the `oneNoteListContext` of the provided context.
 * Which is then used to format the list items within the list.
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
 * Content from OneNote may have ordered lists with specific styles and start numbers.
 * This function processes the `<ul>` elements, extracting the `type` custom attribute
 * to set the appropriate list style in the `oneNoteListContext` of the provided context.
 * Which is then used to format the list items within the list.
 */
export const processUnorderedList: ElementProcessor<HTMLUListElement> = (
    group,
    element,
    cmContext
) => {
    const context = ensureOneNoteListContext(cmContext);

    if (context.oneNoteListContext) {
        const typeOfList = element.getAttribute('type');
        if (typeOfList) {
            const listStyle =
                UnorderedListStyleMap[typeOfList as keyof typeof UnorderedListStyleMap];
            context.oneNoteListContext.listStyleType = listStyle;
        }
    }

    context.defaultElementProcessors.ul?.(group, element, context);
};

/**
 * @internal exported only for unit test
 * Processes the `<li>` elements within a list. It checks if the `oneNoteListContext`
 * is present in the provided context. If so, it applies the list style type and
 * start number override to the last level of the list format.
 * This ensures that the list items are formatted correctly according to the
 * OneNote list context.
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
