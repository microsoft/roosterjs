import { findClosestElementAncestor, getComputedStyle, safeInstanceOf } from 'roosterjs-editor-dom';

/**
 * @internal
 * @param node start node to normalize
 * @param quotesHandled Optional parameter to prevent already modified quotes to be rechecked.
 * @returns
 */
export default function normalizeBlockquote(node: Node, quotesHandled?: Node[]): void {
    if (safeInstanceOf(node, 'HTMLElement')) {
        const alignment = node.style.textAlign;

        let quote = findClosestElementAncestor(node, undefined /* root */, 'blockquote');
        const isNodeRTL = isRTL(node);

        if (quotesHandled) {
            if (quotesHandled.indexOf(quote) > -1) {
                return;
            }
            quotesHandled.push(quote);
        }

        while (quote) {
            if (alignment == 'center') {
                if (isNodeRTL) {
                    delete quote.style.marginInlineEnd;
                    quote.style.marginInlineStart = 'auto';
                } else {
                    delete quote.style.marginInlineStart;
                    quote.style.marginInlineEnd = 'auto';
                }
            } else {
                delete quote.style.marginInlineStart;
                delete quote.style.marginInlineEnd;
            }

            quote = findClosestElementAncestor(
                quote.parentElement,
                undefined /* root */,
                'blockquote'
            );
        }
    }
}

function isRTL(el: Element) {
    return getComputedStyle(el, 'direction') == 'rtl' || el.getAttribute('dir') == 'rtl';
}
