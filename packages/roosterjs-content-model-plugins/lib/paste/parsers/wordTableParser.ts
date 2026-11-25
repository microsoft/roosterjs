import type { ContentModelTableFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for processing table formatting specific to Word Desktop
 * @param format The table format to modify
 * @param element The HTML element being processed
 */
export const wordTableParser: FormatParser<ContentModelTableFormat> = (format, element): void => {
    const align = element.getAttribute('align')?.toLowerCase();
    const float = element.style.float;
    const isFloating = float == 'left' || float == 'right' || align == 'left' || align == 'right';

    // An explicit nonfloating table indent is layout, not list/float compensation.
    if (
        format.marginLeft?.startsWith('-') &&
        (isFloating || !element.style.marginLeft.startsWith('-'))
    ) {
        delete format.marginLeft;
    }
    if (format.htmlAlign) {
        delete format.htmlAlign;
    }
};
