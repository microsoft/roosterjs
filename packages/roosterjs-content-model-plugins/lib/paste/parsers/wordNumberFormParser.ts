import { getStyles } from '../utils/getStyles';
import { getWordNumberFormRules } from '../WordDesktop/getWordNumberFormRules';
import type {
    ContentModelSegmentFormat,
    FontVariantNumericFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordNumberFormParser(html: string): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordNumberFormRules> | undefined;
    return (format, element, _, defaultStyle) => {
        const styles = getStyles(element);
        const numeric = element.style.fontVariantNumeric;
        if (
            (numeric && numeric != 'normal') ||
            (styles['font-variant-numeric'] &&
                /(?:^|;)\s*font-variant-numeric\s*:/i.test(element.style.cssText)) ||
            defaultStyle.fontVariantNumeric
        ) {
            return;
        }
        let value = parseWordNumberForm(styles['mso-number-form']);
        if (!value) {
            rules = rules || getWordNumberFormRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const candidate = parseWordNumberForm(rules[i].value);
                if (candidate && element.matches(rules[i].selector)) {
                    value = candidate;
                    break;
                }
            }
        }
        if (
            value &&
            (value != 'default' ||
                format.wordNumberForm ||
                /(?:lining|oldstyle)-nums/.test(format.fontVariantNumeric || ''))
        ) {
            format.wordNumberForm = value;
        }
    };
}

function parseWordNumberForm(
    value: string | undefined
): FontVariantNumericFormat['wordNumberForm'] {
    const keyword = value?.trim().toLowerCase();
    return keyword == 'default' || keyword == 'lining' || keyword == 'oldstyle'
        ? keyword
        : undefined;
}
