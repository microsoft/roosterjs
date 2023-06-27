import { moveAndReplaceChildNodes } from './moveAndReplaceChildNodes';

/**
 * Unwrap the given HTML element, move all its child nodes to be under its parent and replace this element
 * @param element The element to unwrap
 */
export function unwrapElement(element: HTMLElement) {
    const parent = element.parentNode;

    if (parent) {
        const fragment = element.ownerDocument.createDocumentFragment();

        moveAndReplaceChildNodes(fragment, element);
        parent.replaceChild(fragment, element);
    }
}
