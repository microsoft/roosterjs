import { getStyles } from '../utils/getStyles';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const wordFontKerningParser: FormatParser<ContentModelSegmentFormat> = (
    format,
    element,
    _,
    defaultStyle
) => {
    const threshold = getStyles(element)['mso-font-kerning'];

    if (
        threshold &&
        /^(?:\d+(?:\.\d+)?|\.\d+)pt$/i.test(threshold) &&
        Number.isFinite(parseFloat(threshold)) &&
        !element.style.fontKerning &&
        !defaultStyle.fontKerning
    ) {
        format.wordKerningThreshold = parseFloat(threshold) + 'pt';
        delete format.fontKerning;
    }
};
