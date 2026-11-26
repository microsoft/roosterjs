import { getStyles } from '../utils/getStyles';
import { getWordContextualAlternatesRules } from '../WordDesktop/getWordContextualAlternatesRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordContextualAlternatesParser(
    html: string
): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordContextualAlternatesRules> | undefined;
    return (format, element, _, defaultStyle) => {
        const styles = getStyles(element);
        const variant = element.style.fontVariantLigatures;
        if (
            !(variant && variant != 'normal') &&
            !(
                styles['font-variant-ligatures'] &&
                /(?:^|;)\s*font-variant-ligatures\s*:/i.test(element.style.cssText)
            ) &&
            !defaultStyle.fontVariantLigatures
        ) {
            let alternates = parseWordContextualAlternates(styles['mso-contextual-alternates']);
            if (!alternates) {
                rules = rules || getWordContextualAlternatesRules(html, element.ownerDocument);
                for (let i = rules.length - 1; i >= 0; i--) {
                    const value = parseWordContextualAlternates(rules[i].value);
                    if (value && element.matches(rules[i].selector)) {
                        alternates = value;
                        break;
                    }
                }
            }
            if (alternates) {
                const explicit =
                    element.style.fontFeatureSettings || defaultStyle.fontFeatureSettings;
                if (!explicit || explicit == 'normal' || /^["']/.test(explicit)) {
                    format.wordContextualAlternates = alternates;
                    if (!explicit) {
                        const remaining = removeInheritedContextualAlternates(
                            format.fontFeatureSettings
                        );
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

function parseWordContextualAlternates(value: string | undefined): string | undefined {
    const keyword = value?.trim().toLowerCase();
    if (keyword == 'yes' || keyword == 'no') {
        return `"calt" ${keyword == 'yes' ? 1 : 0}`;
    }
}

function removeInheritedContextualAlternates(value: string | undefined): string | undefined {
    if (!value || value == 'normal') {
        return undefined;
    } else if (value.indexOf('var(') >= 0) {
        return value;
    }
    const clauses = value.match(/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')(?:\s+(?:on|off|\d+))?/g);
    return clauses
        ? clauses.filter(clause => !/^["']calt["']/.test(clause)).join(', ') || undefined
        : value;
}
