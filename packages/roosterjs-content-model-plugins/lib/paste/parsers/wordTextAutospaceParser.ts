import { getStyles } from '../utils/getStyles';
import { getWordTextAutospaceRules } from '../WordDesktop/getWordTextAutospaceRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordTextAutospaceParser(
    html: string
): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordTextAutospaceRules> | undefined;
    return (format, element) => {
        if (element.style.getPropertyValue('text-autospace')) {
            return;
        }
        let value = parseWordAutospace(getStyles(element)['text-autospace']);
        if (!value) {
            rules = rules || getWordTextAutospaceRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const ruleValue = parseWordAutospace(rules[i].value);
                if (ruleValue && element.matches(rules[i].selector)) {
                    value = ruleValue;
                    break;
                }
            }
        }
        if (value) {
            format.textAutospace = value;
        }
    };
}

function parseWordAutospace(value: string | undefined): string | undefined {
    const normalized = value?.trim().toLowerCase();
    if (normalized == 'none') {
        return 'no-autospace';
    }
    const tokens = normalized?.split(/\s+/) || [];
    if (
        tokens.length &&
        tokens.length <= 2 &&
        tokens.every(token => /^(?:ideograph-other|ideograph-alpha|ideograph-numeric)$/.test(token))
    ) {
        const alpha = tokens.some(token => token != 'ideograph-numeric');
        const numeric = tokens.includes('ideograph-numeric');
        if (tokens.length == 1 || (alpha && numeric)) {
            return alpha && numeric ? 'normal' : alpha ? 'ideograph-alpha' : 'ideograph-numeric';
        }
    }
}
