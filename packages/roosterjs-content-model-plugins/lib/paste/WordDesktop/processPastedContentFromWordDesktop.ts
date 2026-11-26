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
import { removeListParagraphMargins } from './removeListParagraphMargins';
import { wordBorderParser } from './wordBorderParser';
import type { WordMetadata } from './WordMetadata';
import type { WordListMargins } from './processWordLists';
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
 * @param fragment Original paste fragment before stylesheet conversion
 * @param styleSanitizers Live margin sanitizer policies
 */
export function processPastedContentFromWordDesktop(
    domToModelOption: DomToModelOption,
    htmlString: string,
    globalCssRules: CssRule[] = [],
    fragment?: ParentNode,
    styleSanitizers: Readonly<Record<string, ValueSanitizer>> = {}
) {
    const explicitMargins = new WeakMap<HTMLElement, { left: boolean; right: boolean }>();
    fragment?.querySelectorAll<HTMLElement>('[style]').forEach(element => {
        if (element.style?.marginLeft || element.style?.marginRight) {
            explicitMargins.set(element, {
                left: !!element.style.marginLeft,
                right: !!element.style.marginRight,
            });
        }
    });
    removeListParagraphMargins(globalCssRules);

    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(htmlString);

    setProcessor(
        domToModelOption,
        'element',
        wordDesktopElementProcessor(metadataMap, explicitMargins, styleSanitizers)
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
    explicitMargins: WeakMap<HTMLElement, { left: boolean; right: boolean }>,
    sanitizers: Readonly<Record<string, ValueSanitizer>>
): ElementProcessor<HTMLElement> => {
    const getMargins = (element: HTMLElement): WordListMargins => {
        const explicit = explicitMargins.get(element);
        function getMargin(
            key: 'marginLeft' | 'marginRight',
            property: string,
            isExplicit: boolean
        ) {
            const raw = element.style[key];
            const sanitizer = sanitizers[property];
            const value = !raw
                ? undefined
                : typeof sanitizer == 'function'
                ? sanitizer(raw, element.tagName)
                : sanitizer === false
                ? null
                : raw;
            return { value, isExplicit, isSanitized: sanitizer !== undefined };
        }
        return {
            left: getMargin('marginLeft', 'margin-left', !!explicit?.left),
            right: getMargin('marginRight', 'margin-right', !!explicit?.right),
            sanitizePadding: property => {
                const sanitizer = sanitizers[property];
                return typeof sanitizer == 'function'
                    ? sanitizer('0px', element.tagName)
                    : sanitizer === false
                    ? null
                    : '0px';
            },
        };
    };
    return (group, element, context) => {
        const styles = getStyles(element);
        // Process Word Lists or Word Commands, otherwise use the default processor on this element.
        if (
            !(
                processWordList(styles, group, element, context, metadataKey, getMargins) ||
                processWordComments(styles, element)
            )
        ) {
            context.defaultElementProcessors.element(group, element, context);
        }
    };
};
