import { getStyles } from '../utils/getStyles';
import { getWordHyphenationRules } from '../WordDesktop/getWordHyphenationRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordHyphenationParser(html: string): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordHyphenationRules> | undefined;
    const automatic = /<w:AutoHyphenation\s*\/?>/i.test(html);
    return (format, element, _, defaultStyle) => {
        if (element.style.hyphens || defaultStyle.hyphens) {
            return;
        }
        let value: string | undefined = getStyles(element)['mso-hyphenate']?.trim().toLowerCase();
        if (value != 'none' && value != 'auto') {
            rules = rules || getWordHyphenationRules(html, element.ownerDocument);
            value = undefined;
            for (let i = rules.length - 1; i >= 0; i--) {
                if (element.matches(rules[i].selector)) {
                    value = rules[i].value;
                    break;
                }
            }
        }
        if (value == 'none' || value == 'auto') {
            // The native opt-out suppresses automatic, not supplied discretionary hyphens.
            format.hyphens = value == 'auto' && automatic ? 'auto' : 'manual';
        }
    };
}
