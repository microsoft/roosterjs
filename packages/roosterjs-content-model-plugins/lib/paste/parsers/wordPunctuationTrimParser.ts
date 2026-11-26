import { createWordCssLookup } from '../WordDesktop/createWordCssLookup';
import type { FormatParser, TextSpacingTrimFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordPunctuationTrimParser(html: string): FormatParser<TextSpacingTrimFormat> {
    const lookup = createWordCssLookup(html, ['punctuation-trim']);
    return (format, element) => {
        if (element.style.getPropertyValue('text-spacing-trim')) {
            return;
        }
        const value = lookup(element)['punctuation-trim']?.trim().toLowerCase();
        if (value == 'leading') {
            format.textSpacingTrim = 'trim-start';
        } else if (value == 'none') {
            format.textSpacingTrim = 'space-all';
        }
    };
}
