import { toArray } from '../toArray';
import type { CssRule } from 'roosterjs-content-model-types';

/**
 * @internal
 *
 * Splits CSS selectors, avoiding splits within parentheses
 * @param selectorText The CSS selector string
 * @return Array of trimmed selectors
 */
function splitSelectors(selectorText: string) {
    const regex = /(?![^(]*\)),/;
    return selectorText.split(regex).map(s => s.trim());
}

/**
 * Retrieves CSS rules from a document's style elements.
 * @param doc The document to retrieve CSS rules from
 */
export function retrieveCssRules(doc: Document): CssRule[] {
    const styles = toArray(doc.querySelectorAll('style'));
    const result: CssRule[] = [];

    styles.forEach(styleNode => {
        const sheet = styleNode.sheet;

        if (sheet) {
            for (let ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
                const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

                if (rule.type == CSSRule.STYLE_RULE && rule.selectorText) {
                    result.push({
                        selectors: splitSelectors(rule.selectorText),
                        text: rule.style.cssText,
                    });
                }
            }
        }

        styleNode.parentNode?.removeChild(styleNode);
    });

    return result;
}
