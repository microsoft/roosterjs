import { getStyles } from '../utils/getStyles';
import { getWordTextJustifyRules } from '../WordDesktop/getWordTextJustifyRules';
import type { ContentModelBlockFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordTextJustifyParser(html: string): FormatParser<ContentModelBlockFormat> {
    let rules: ReturnType<typeof getWordTextJustifyRules> | undefined;
    return (format, element, _, defaultStyle) => {
        if (element.style.textAlignLast || defaultStyle.textAlignLast) {
            return;
        }
        let value: string | undefined = getStyles(element)['text-justify']?.trim().toLowerCase();
        if (!value) {
            rules = rules || getWordTextJustifyRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                if (element.matches(rules[i].selector)) {
                    value = rules[i].value;
                    break;
                }
            }
        }
        if (value == 'distribute-all-lines') {
            format.textAlignLast = 'justify';
        }
    };
}
