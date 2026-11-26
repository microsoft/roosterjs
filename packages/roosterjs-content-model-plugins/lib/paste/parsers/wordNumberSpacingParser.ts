import { getStyles } from '../utils/getStyles';
import { getWordNumberSpacingRules } from '../WordDesktop/getWordNumberSpacingRules';
import type {
    ContentModelSegmentFormat,
    FontVariantNumericFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordNumberSpacingParser(
    html: string
): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordNumberSpacingRules> | undefined;
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
        let value = parseWordNumberSpacing(styles['mso-number-spacing']);
        if (!value) {
            rules = rules || getWordNumberSpacingRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const candidate = parseWordNumberSpacing(rules[i].value);
                if (candidate && element.matches(rules[i].selector)) {
                    value = candidate;
                    break;
                }
            }
        }
        if (
            value &&
            (value != 'default' ||
                format.wordNumberSpacing ||
                /(?:tabular|proportional)-nums/.test(format.fontVariantNumeric || ''))
        ) {
            format.wordNumberSpacing = value;
        }
    };
}

function parseWordNumberSpacing(
    value: string | undefined
): FontVariantNumericFormat['wordNumberSpacing'] {
    const keyword = value?.trim().toLowerCase();
    return keyword == 'default' || keyword == 'tabular' || keyword == 'proportional'
        ? keyword
        : undefined;
}
