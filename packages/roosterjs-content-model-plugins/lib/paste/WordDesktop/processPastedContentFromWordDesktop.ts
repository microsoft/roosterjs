import { addParser } from '../utils/addParser';
import { getStyleMetadata } from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { removeNegativeTextIndentParser } from './removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import type { WordMetadata } from './WordMetadata';
import type {
    BeforePasteEvent,
    ContentModelListItemLevelFormatCommon,
    ContentModelTableFormatCommon,
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

const listLevelParser: FormatParser<ContentModelListItemLevelFormatCommon> = (
    format,
    element,
    _,
    defaultStyle
) => {
    if (element.style.marginLeft != '') {
        format.marginLeft = defaultStyle.marginLeft;
    }

    format.marginBottom = undefined;
};

const wordTableParser: FormatParser<ContentModelTableFormatCommon> = (format): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
};
