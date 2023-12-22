import addParser from '../utils/addParser';
import getStyleMetadata from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { setProcessor } from '../utils/setProcessor';
import type { WordMetadata } from './WordMetadata';
import type {
    ContentModelBeforePasteEvent,
    ContentModelBlockFormat,
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    ContentModelTableFormat,
    DomToModelContext,
    ElementProcessor,
    FormatParser,
} from 'roosterjs-content-model-types';

const PERCENTAGE_REGEX = /%/;
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 120;

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev ContentModelBeforePasteEvent
 */
export function processPastedContentFromWordDesktop(
    ev: ContentModelBeforePasteEvent,
    trustedHTMLHandler: (text: string) => string
) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(ev, trustedHTMLHandler);

    setProcessor(ev.domToModelOption, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(ev.domToModelOption, 'block', removeNonValidLineHeight);
    addParser(ev.domToModelOption, 'listLevel', listLevelParser);
    addParser(ev.domToModelOption, 'listItemElement', listItemElementParser);
    addParser(ev.domToModelOption, 'container', wordTableParser);
    addParser(ev.domToModelOption, 'table', wordTableParser);
}

const wordDesktopElementProcessor = (
    metadataKey: Map<string, WordMetadata>
): ElementProcessor<HTMLElement> => {
    return (group, element, context) => {
        const styles = getStyles(element);
        // Process Word Lists or Word Commands, otherwise use the default processor on this element.
        if (
            !(
                processWordList(styles, group, element, context, metadataKey) ||
                processWordComments(styles, element)
            )
        ) {
            context.defaultElementProcessors.element(group, element, context);
        }
    };
};

function removeNonValidLineHeight(
    format: ContentModelBlockFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
): void {
    //If the line height is less than the browser default line height, line between the text is going to be too narrow
    let parsedLineHeight: number;
    if (
        PERCENTAGE_REGEX.test(element.style.lineHeight) &&
        !isNaN((parsedLineHeight = parseInt(element.style.lineHeight))) &&
        parsedLineHeight < DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE
    ) {
        format.lineHeight = defaultStyle.lineHeight;
    }
}

function listLevelParser(
    format: ContentModelListItemLevelFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
): void {
    if (element.style.marginLeft != '') {
        format.marginLeft = defaultStyle.marginLeft;
    }

    format.marginBottom = undefined;
}

const listItemElementParser: FormatParser<ContentModelListItemFormat> = (
    format: ContentModelListItemFormat,
    element: HTMLElement
): void => {
    if (element.style.marginLeft) {
        format.marginLeft = undefined;
    }
    if (element.style.marginRight) {
        format.marginRight = undefined;
    }
};

const wordTableParser: FormatParser<ContentModelTableFormat> = (format): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
};
