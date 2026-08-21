import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import type { FormatParser, MarginFormat } from 'roosterjs-content-model-types';

const MSO_LIST_PARAGRAPH_CLASS = 'MsoListParagraph';

// Default list padding from the HTML user-agent stylesheet (paddingInlineStart for <ul>/<ol>)
const DEFAULT_LIST_PADDING_INLINE_START = '40px';

/**
 * @internal
 * Parser that subtracts the default list format (paddingInlineStart: 40px) from
 * the marginLeft of list item elements that have the MsoListParagraph class,
 * since Word adds the full indentation as margin on the paragraph, which
 * duplicates the padding the list element already provides.
 */
export const adjustWordListMarginParser: FormatParser<MarginFormat> = (
    format: MarginFormat,
    element: HTMLElement
): void => {
    if (element.classList.contains(MSO_LIST_PARAGRAPH_CLASS) && format.marginLeft) {
        const currentPx = parseValueWithUnit(format.marginLeft, element);
        const defaultPx = parseValueWithUnit(DEFAULT_LIST_PADDING_INLINE_START);
        const result = currentPx - defaultPx;

        if (result > 0) {
            format.marginLeft = `${result}px`;
        }
    }
};
