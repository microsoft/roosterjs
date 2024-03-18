import { toArray } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export interface CssRule {
    selectors: string[];
    text: string;
}

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
 * @internal
 */
export function retrieveCssRules(doc: Document): CssRule[] {
    const styles = toArray(doc.querySelectorAll('style'));
    const result: CssRule[] = [];

    styles.forEach(styleNode => {
        const sheet = styleNode.sheet as CSSStyleSheet;

        for (let ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
            const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

            if (rule.type == CSSRule.STYLE_RULE && rule.selectorText) {
                result.push({
                    selectors: splitSelectors(rule.selectorText),
                    text: rule.style.cssText,
                });
            }
        }

        styleNode.parentNode?.removeChild(styleNode);
    });

    return result;
}

/**
 * @internal
 */
export function convertInlineCss(root: ParentNode, cssRules: CssRule[]) {
    for (let i = cssRules.length - 1; i >= 0; i--) {
        const { selectors, text } = cssRules[i];

        for (const selector of selectors) {
            if (!selector || !selector.trim()) {
                continue;
            }

            const nodes = toArray(root.querySelectorAll(selector));

            // Always put existing styles after so that they have higher priority
            // Which means if both global style and inline style apply to the same element,
            // inline style will have higher priority
            nodes.forEach(node =>
                node.setAttribute('style', text + (node.getAttribute('style') || ''))
            );
        }
    }
}
