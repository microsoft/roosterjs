import { addParser } from '../utils/addParser';
import { getStyleMetadata } from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { handleInlineImages } from './handleInlineImages';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { removeNegativeTextIndentParser } from './removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import type { WordMetadata } from './WordMetadata';
import type {
    BeforePasteEvent,
    ContentModelListItemLevelFormat,
    ContentModelTableFormat,
    DomToModelContext,
    ElementProcessor,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev BeforePasteEvent
 */
export function processPastedContentFromWordDesktop(
    ev: BeforePasteEvent,
    trustedHTMLHandler: (text: string) => string
) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(ev, trustedHTMLHandler);

    setProcessor(ev.domToModelOption, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(ev.domToModelOption, 'block', removeNegativeTextIndentParser);
    addParser(ev.domToModelOption, 'listLevel', listLevelParser);
    addParser(ev.domToModelOption, 'container', wordTableParser);
    addParser(ev.domToModelOption, 'table', wordTableParser);

    handleInlineImages(ev.fragment, ev.clipboardData.rtf);
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

const wordTableParser: FormatParser<ContentModelTableFormat> = (format): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
};
