import { addParser } from '../utils/addParser';
import { adjustPercentileLineHeight } from '../parsers/adjustPercentileLineHeightParser';
import { getStyleMetadata } from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { listLevelParser } from '../parsers/listLevelParser';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { adjustWordListMarginParser } from '../parsers/adjustWordListMarginParser';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import { wordContainerParser } from '../parsers/wordContainerParser';
import { wordTableParser } from '../parsers/wordTableParser';
import type { WordMetadata } from './WordMetadata';
import type { DomToModelOption, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handles pasted content when the source is Word Desktop.
 * @param domToModelOption Options for DOM to Content Model conversion
 * @param htmlString The HTML string to process
 */
export function processPastedContentFromWordDesktop(
    domToModelOption: DomToModelOption,
    htmlString: string
) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(htmlString);

    setProcessor(domToModelOption, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(domToModelOption, 'block', adjustPercentileLineHeight);
    addParser(domToModelOption, 'block', removeNegativeTextIndentParser);
    addParser(domToModelOption, 'listItemElement', removeNegativeTextIndentParser);
    addParser(domToModelOption, 'listItemElement', adjustWordListMarginParser);
    addParser(domToModelOption, 'listLevel', listLevelParser);
    addParser(domToModelOption, 'container', wordContainerParser);
    addParser(domToModelOption, 'table', wordTableParser);
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
