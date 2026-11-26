import { getStyles } from '../utils/getStyles';
import { getWordLigatureRules } from '../WordDesktop/getWordLigatureRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordLigatureParser(html: string): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordLigatureRules> | undefined;

    return (format, element, _, defaultStyle) => {
        if (!element.style.fontVariantLigatures && !defaultStyle.fontVariantLigatures) {
            let ligatures = parseWordLigatures(getStyles(element)['mso-ligatures']);

            if (!ligatures) {
                rules = rules || getWordLigatureRules(html, element.ownerDocument);
                for (let i = rules.length - 1; i >= 0; i--) {
                    const value = parseWordLigatures(rules[i].value);
                    if (value && element.matches(rules[i].selector)) {
                        ligatures = value;
                        break;
                    }
                }
            }

            if (ligatures) {
                const explicit =
                    element.style.fontFeatureSettings || defaultStyle.fontFeatureSettings;
                if (!explicit || explicit == 'normal' || /^["']/.test(explicit)) {
                    format.wordLigatureFeatures = ligatures;
                    if (!explicit) {
                        const remaining = removeInheritedLigatureFeatures(
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

/**
 * @internal
 */
export function parseWordLigatures(value: string | undefined): string | undefined {
    const keyword = value?.trim().toLowerCase();

    if (
        keyword &&
        (keyword == 'none' ||
            keyword == 'all' ||
            /^(standard)?(contextual)?(historical)?(discretionary)?$/.test(keyword))
    ) {
        // Word contextual ligatures use clig; CSS contextual instead controls calt.
        return [
            ['liga', 'standard'],
            ['clig', 'contextual'],
            ['hlig', 'historical'],
            ['dlig', 'discretionary'],
        ]
            .map(
                ([tag, name]) =>
                    `"${tag}" ${keyword == 'all' || keyword.indexOf(name) >= 0 ? 1 : 0}`
            )
            .join(', ');
    }
}

function removeInheritedLigatureFeatures(value: string | undefined): string | undefined {
    if (!value || value == 'normal') {
        return undefined;
    } else if (value.indexOf('var(') >= 0) {
        return value;
    }

    const clauses = value.match(/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')(?:\s+(?:on|off|\d+))?/g);
    return clauses
        ? clauses.filter(clause => !/^["'](?:liga|clig|hlig|dlig)["']/.test(clause)).join(', ') ||
              undefined
        : value;
}
