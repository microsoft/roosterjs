import { toArray } from 'roosterjs-content-model-dom';
import { getCssSelectorSpecificity, splitCssSelectorList } from './getCssSelectorSpecificity';
import type { CssRule } from 'roosterjs-content-model-types';

/**
 * @internal
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
                        selectors: splitCssSelectorList(rule.selectorText),
                        text: rule.style.cssText,
                    });
                }
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
    const rankedRules: {
        selector: string;
        text: string;
        specificity: [number, number, number];
        order: number;
    }[] = [];

    cssRules.forEach(({ selectors, text }) => {
        selectors.forEach(selectorText => {
            splitCssSelectorList(selectorText).forEach(selector => {
                if (selector) {
                    rankedRules.push({
                        selector,
                        text,
                        specificity: getCssSelectorSpecificity(selector),
                        order: rankedRules.length,
                    });
                }
            });
        });
    });

    rankedRules.sort(
        (a, b) =>
            a.specificity[0] - b.specificity[0] ||
            a.specificity[1] - b.specificity[1] ||
            a.specificity[2] - b.specificity[2] ||
            a.order - b.order
    );

    // Match before adding style attributes, which can themselves be used by selectors.
    const matchedRules = rankedRules.map(({ selector, text }) => ({
        text,
        nodes: toArray(root.querySelectorAll(selector)),
    }));

    for (let i = matchedRules.length - 1; i >= 0; i--) {
        const { nodes, text } = matchedRules[i];
        // Inline declarations stay last; the browser also retains !important precedence.
        nodes.forEach(node =>
            node.setAttribute('style', text + (node.getAttribute('style') || ''))
        );
    }
}
