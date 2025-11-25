import { wordContainerParser } from './wordContainerParser';
import type { ContentModelTableFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for processing table formatting specific to Word Desktop
 * @param format The table format to modify
 * @param element The HTML element being processed
 */
export const wordTableParser: FormatParser<ContentModelTableFormat> = (format, element): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
    if (format.htmlAlign) {
        delete format.htmlAlign;
    }
};

export { wordContainerParser };
