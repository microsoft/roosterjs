import { createWordCssLookup } from '../WordDesktop/createWordCssLookup';
import type { FormatParser, WidowOrphanFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordWidowOrphanParser(html: string): FormatParser<WidowOrphanFormat> {
    const lookup = createWordCssLookup(html, ['mso-pagination']);
    return (format, element) => {
        const value = lookup(element)['mso-pagination']?.trim().toLowerCase();
        if (
            value == 'none' ||
            (value &&
                /^(?:widow-orphan|lines-together|no-line-numbers)(?:\s+(?:widow-orphan|lines-together|no-line-numbers))*$/.test(
                    value
                ))
        ) {
            const count = value.split(/\s+/).includes('widow-orphan') ? '2' : '1';
            const keys = ['widows', 'orphans'] as const;
            keys.forEach(key => {
                // Two is the CSS initial value; only store it when resetting inherited constraints.
                if (!element.style[key] && (count == '1' || format[key])) {
                    format[key] = count;
                }
            });
        }
    };
}
