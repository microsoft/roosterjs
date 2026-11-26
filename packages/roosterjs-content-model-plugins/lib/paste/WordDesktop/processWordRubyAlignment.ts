import { createWordCssLookup } from './createWordCssLookup';
import type { ValueSanitizer } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordRubyAlignmentProcessor(
    html: string,
    styleSanitizers?: Record<string, ValueSanitizer>
) {
    const getNativeStyles = createWordCssLookup(html, ['ruby-align']);
    return (element: HTMLElement) => {
        if (element.tagName != 'RUBY' || element.style.getPropertyValue('ruby-align')) {
            return;
        }
        const value = getNativeStyles(element)['ruby-align']?.trim().toLowerCase();
        if (value == 'distribute-letter' || value == 'distribute-space') {
            const converted = value == 'distribute-letter' ? 'space-between' : 'space-around';
            const sanitizer = styleSanitizers?.['ruby-align'];
            const sanitized =
                typeof sanitizer == 'function'
                    ? sanitizer(converted, element.tagName)
                    : sanitizer === false
                    ? null
                    : converted;
            if (sanitized) {
                element.style.setProperty('ruby-align', sanitized);
            }
        }
    };
}
