import { createWordCssLookup } from '../WordDesktop/createWordCssLookup';
import type { DiagonalBorderFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordDiagonalBorderParser(html: string): FormatParser<DiagonalBorderFormat> {
    const lookup = createWordCssLookup(html, ['mso-diagonal-down', 'mso-diagonal-up']);
    return (format, element) => {
        const styles = lookup(element);
        const keys = ['diagonalDown', 'diagonalUp'] as const;
        keys.forEach((key, index) => {
            const value = styles[index ? 'mso-diagonal-up' : 'mso-diagonal-down'];
            if (value && !format[key]) {
                format[key] = value;
            }
        });
    };
}
