import { addParser } from '../utils/addParser';
import { adjustPercentileLineHeight } from '../parsers/adjustPercentileLineHeightParser';
import { getStyleMetadata } from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { listLevelParser } from '../parsers/listLevelParser';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import { wordTableParser } from '../parsers/wordTableParser';
import type { WordMetadata } from './WordMetadata';
import type { BeforePasteEvent, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev BeforePasteEvent
 */
export function processPastedContentFromWordDesktop(ev: BeforePasteEvent) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(ev);

    setProcessor(ev.domToModelOption, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(ev.domToModelOption, 'block', adjustPercentileLineHeight);
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
