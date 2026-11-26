import { createWordCssLookup } from './createWordCssLookup';
import type { FormatParser, OutlineLevelFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordOutlineLevelParser(html: string): FormatParser<OutlineLevelFormat> {
    const getNativeStyles = createWordCssLookup(html, ['mso-outline-level']);
    return (format, element) => {
        if (element.tagName != 'P' || element.hasAttribute('role')) {
            return;
        }
        const styles = getNativeStyles(element);
        if (styles['mso-list'] && styles['mso-list'].toLowerCase() != 'none') {
            return;
        }
        const value = styles['mso-outline-level']?.trim();
        if (value && /^[1-9]$/.test(value)) {
            format.outlineLevel = Number(value);
        }
    };
}
