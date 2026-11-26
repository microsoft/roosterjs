import { addParser } from '../utils/addParser';
import { chainSanitizerCallback } from '../utils/chainSanitizerCallback';
import { adjustPercentileLineHeight } from '../parsers/adjustPercentileLineHeightParser';
import { getStyleMetadata } from './getStyleMetadata';
import { createWordRubyAlignmentProcessor } from './processWordRubyAlignment';
import { getStyles } from '../utils/getStyles';
import { listLevelParser } from '../parsers/listLevelParser';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { adjustWordListMarginParser } from '../parsers/adjustWordListMarginParser';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import { wordContainerParser } from '../parsers/wordContainerParser';
import { wordTableParser } from '../parsers/wordTableParser';
import { removeListParagraphMargins } from './removeListParagraphMargins';
import { wordBorderParser } from './wordBorderParser';
import type { WordMetadata } from './WordMetadata';
import type {
    CssRule,
    DomToModelOption,
    ElementProcessor,
    ValueSanitizer,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Handles pasted content when the source is Word Desktop.
 * @param domToModelOption Options for DOM to Content Model conversion
 * @param htmlString The HTML string to process
 * @param globalCssRules Global CSS rules extracted from the pasted document
 */
export function processPastedContentFromWordDesktop(
    domToModelOption: DomToModelOption,
    htmlString: string,
    globalCssRules: CssRule[] = [],
    styleSanitizers?: Record<string, ValueSanitizer>
) {
    removeListParagraphMargins(globalCssRules);

    if (styleSanitizers && styleSanitizers['ruby-align'] !== false) {
        // Preserve explicit CSS resets before the general sanitizer drops initial/inherit.
        chainSanitizerCallback(styleSanitizers, 'ruby-align', (value, tagName) =>
            tagName.toLowerCase() == 'ruby'
                ? value == 'initial'
                    ? 'space-around'
                    : value == 'inherit'
                    ? 'unset'
                    : value
                : value
        );
    }
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(htmlString);

    setProcessor(
        domToModelOption,
        'element',
        wordDesktopElementProcessor(
            metadataMap,
            createWordRubyAlignmentProcessor(htmlString, styleSanitizers)
        )
    );
    addParser(domToModelOption, 'block', adjustPercentileLineHeight);
    addParser(domToModelOption, 'block', removeNegativeTextIndentParser);
    addParser(domToModelOption, 'listItemElement', removeNegativeTextIndentParser);
    addParser(domToModelOption, 'listItemElement', adjustWordListMarginParser);
    addParser(domToModelOption, 'listLevel', listLevelParser);
    addParser(domToModelOption, 'container', wordContainerParser);
    addParser(domToModelOption, 'table', wordTableParser);
    addParser(domToModelOption, 'tableBorder', wordBorderParser);
}

const wordDesktopElementProcessor = (
    metadataKey: Map<string, WordMetadata>,
    processRubyAlignment: (element: HTMLElement) => void
): ElementProcessor<HTMLElement> => {
    return (group, element, context) => {
        processRubyAlignment(element);
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
