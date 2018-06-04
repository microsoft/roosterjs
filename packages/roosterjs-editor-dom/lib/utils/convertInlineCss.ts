/**
 * Convert global CSS to inline CSS and remove the global CSS
 * @param html The source HTML string
 * @param additionalStyleNodes Optional additional style nodes
 */
export default function convertInlineCss(
    html: string,
    additionalStyleNodes?: HTMLStyleElement[]
): string {
    let parser = new DOMParser();
    let doc: Document;

    if (
        !html ||
        !html.trim() ||
        !(doc = parser.parseFromString(html, 'text/html')) ||
        !doc.body ||
        !doc.body.firstChild
    ) {
        return '';
    }

    convertInlineCssInDom(doc, additionalStyleNodes);

    return doc.body.innerHTML;
}

export function convertInlineCssInDom(doc: Document, additionalStyleNodes: HTMLStyleElement[]) {
    let styleNodes = toArray(doc.querySelectorAll('style'));
    let styleSheets = (additionalStyleNodes || [])
        .reverse()
        .map(node => node.sheet as CSSStyleSheet)
        .concat(styleNodes.map(node => node.sheet as CSSStyleSheet).reverse());
    for (let styleSheet of styleSheets) {
        for (let j = styleSheet.cssRules.length - 1; j >= 0; j--) {
            // Skip any none-style rule, i.e. @page
            let styleRule = styleSheet.cssRules[j] as CSSStyleRule;
            let text = styleRule && styleRule.style ? styleRule.style.cssText : null;
            if (styleRule.type != CSSRule.STYLE_RULE || !text || !styleRule.selectorText) {
                continue;
            }
            // Make sure the selector is not empty
            for (let selector of styleRule.selectorText.split(',')) {
                if (!selector || !selector.trim() || selector.indexOf(':') >= 0) {
                    continue;
                }
                let nodes = toArray(doc.querySelectorAll(selector));
                // Always put existing styles after so that they have higher priority
                // Which means if both global style and inline style apply to the same element,
                // inline style will have higher priority
                nodes.forEach(node =>
                    node.setAttribute('style', text + (node.getAttribute('style') || ''))
                );
            }
        }
    }

    styleNodes.forEach(node => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });
}

function toArray<T extends Node>(list: NodeListOf<T>): T[] {
    return [].slice.call(list) as T[];
}
