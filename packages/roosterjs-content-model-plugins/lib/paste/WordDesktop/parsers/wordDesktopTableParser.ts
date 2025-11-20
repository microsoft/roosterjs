import type { ContentModelTableFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for Word Desktop table formatting
 * Handles specific formatting adjustments for tables from Word Desktop
 */
export const wordDesktopTableParser: FormatParser<ContentModelTableFormat> = (
    format: ContentModelTableFormat
): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
    if (format.htmlAlign) {
        delete format.htmlAlign;
    }
};
