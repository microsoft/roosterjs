import safeInstanceOf from './safeInstanceOf';

/**
 * Get innerHTML of the given node
 * @param node The DOM node to get innerHTML from
 */
export default function getInnerHTML(node: HTMLElement | DocumentFragment) {
    if (safeInstanceOf(node, 'HTMLElement')) {
        return node.innerHTML;
    } else if (node) {
        const tempNode = node.ownerDocument.createElement('span');
        tempNode.appendChild(node.cloneNode(true /*deep*/));
        return tempNode.innerHTML;
    } else {
        return '';
    }
}
