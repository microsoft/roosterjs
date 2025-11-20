import { addParser } from '../utils/addParser';
import { getStyleMetadata } from './getStyleMetadata';
import { getStyles } from '../utils/getStyles';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import type { WordMetadata } from './WordMetadata';
import type {
    ContentModelBlockFormat,
    ContentModelListItemLevelFormat,
    ContentModelTableFormat,
    DomToModelContext,
    DomToModelOption,
    ElementProcessor,
    FormatParser,
} from 'roosterjs-content-model-types';

const PERCENTAGE_REGEX = /%/;
// Default line height in browsers according to https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#normal
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 1.2;

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev BeforePasteEvent
 */
export function processPastedContentFromWordDesktop(
    domToModelOption: DomToModelOption,
    htmlString: string
) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(htmlString);

    setProcessor(domToModelOption, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(domToModelOption, 'block', adjustPercentileLineHeight);
    addParser(domToModelOption, 'block', removeNegativeTextIndentParser);
    addParser(domToModelOption, 'listLevel', listLevelParser);
    addParser(domToModelOption, 'container', wordTableParser);
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

function adjustPercentileLineHeight(format: ContentModelBlockFormat, element: HTMLElement): void {
    //If the line height is less than the browser default line height, line between the text is going to be too narrow
    let parsedLineHeight: number;
    if (
        PERCENTAGE_REGEX.test(element.style.lineHeight) &&
        !isNaN((parsedLineHeight = parseInt(element.style.lineHeight)))
    ) {
        format.lineHeight = (
            DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE *
            (parsedLineHeight / 100)
        ).toString();
    }
}

const listLevelParser: FormatParser<ContentModelListItemLevelFormat> = (
    format: ContentModelListItemLevelFormat,
    element: HTMLElement,
    _context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
) => {
    if (element.style.marginLeft != '') {
        format.marginLeft = defaultStyle.marginLeft;
    }

    format.marginBottom = undefined;
};

const wordTableParser: FormatParser<ContentModelTableFormat> = (format, element): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
    if (format.htmlAlign) {
        delete format.htmlAlign;
    }
};
