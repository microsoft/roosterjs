import { getStyles } from '../utils/getStyles';
import { getWordStylisticSetRules } from '../WordDesktop/getWordStylisticSetRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

const STYLISTIC_SET_TAG = /^["']ss(?:0[1-9]|1\d|20)["']/;

/**
 * @internal
 */
export function createWordStylisticSetParser(
    html: string
): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordStylisticSetRules> | undefined;
    return (format, element, _, defaultStyle) => {
        const styles = getStyles(element);
        let mask = parseWordStylisticSet(styles['mso-stylistic-set']);
        if (mask === undefined) {
            rules = rules || getWordStylisticSetRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const value = parseWordStylisticSet(rules[i].value);
                if (value !== undefined && element.matches(rules[i].selector)) {
                    mask = value;
                    break;
                }
            }
        }
        if (mask !== undefined) {
            const explicit = element.style.fontFeatureSettings || defaultStyle.fontFeatureSettings;
            if (!explicit || explicit == 'normal' || /^["']/.test(explicit)) {
                const inherited = format.fontFeatureSettings?.match(
                    /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')(?:\s+(?:on|off|\d+))?/g
                );
                if (
                    mask ||
                    format.wordStylisticSetFeatures ||
                    inherited?.some(clause => STYLISTIC_SET_TAG.test(clause))
                ) {
                    const selectedMask = mask;
                    format.wordStylisticSetFeatures = Array.from(
                        { length: 20 },
                        (_, index) =>
                            `"ss${('0' + (index + 1)).slice(-2)}" ${
                                (selectedMask & (1 << index)) != 0 ? 1 : 0
                            }`
                    ).join(', ');
                    if (
                        !explicit &&
                        inherited &&
                        format.fontFeatureSettings?.indexOf('var(') == -1
                    ) {
                        const remaining = inherited
                            .filter(clause => !STYLISTIC_SET_TAG.test(clause))
                            .join(', ');
                        if (remaining) {
                            format.fontFeatureSettings = remaining;
                        } else {
                            delete format.fontFeatureSettings;
                        }
                    }
                }
            }
        }
    };
}

/**
 * @internal
 */
export function parseWordStylisticSet(value: string | undefined): number | undefined {
    const text = value?.trim();
    if (text && /^\d+$/.test(text)) {
        const mask = Number(text);
        // The current Word layout adapter accepts default or exactly one of twenty bits.
        if (Number.isSafeInteger(mask) && mask <= 0x80000 && (mask & (mask - 1)) == 0) {
            return mask;
        }
    }
}
