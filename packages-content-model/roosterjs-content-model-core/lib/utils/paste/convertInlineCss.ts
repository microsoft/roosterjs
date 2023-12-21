import { toArray } from 'roosterjs-content-model-dom';
import type { CssRule } from './retrieveHtmlInfo';

/**
 * @internal
 */
export function convertInlineCss(root: ParentNode, cssRules: CssRule[]) {
    for (let i = cssRules.length - 1; i >= 0; i--) {
        const { selectors, text } = cssRules[i];

        for (const selector of selectors) {
            if (!selector || !selector.trim() || selector.indexOf(':') >= 0) {
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
