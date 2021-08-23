import createElement from './createElement';
import fromHtml from './fromHtml';
import safeInstanceOf from '../utils/safeInstanceOf';
import { CreateElementData, KnownCreateElementDataIndex } from 'roosterjs-editor-types';

/**
 * Wrap all the node with html and return the wrapped node, and put the wrapper node under the parent of the first node
 * @param nodes The node or node array to wrap
 * @param wrapper The wrapper HTML tag name
 * @returns The wrapper element
 */
export default function wrap<T extends keyof HTMLElementTagNameMap>(
    nodes: Node | Node[],
    wrapper?: T
): HTMLElementTagNameMap[T];

/**
 * @deprecated
 * Wrap all the node with html and return the wrapped node, and put the wrapper node under the parent of the first node
 * @param nodes The node or node array to wrap
 * @param wrapper The wrapper HTML string, default value is DIV
 * @returns The wrapper element
 */
export default function wrap(nodes: Node | Node[], wrapper?: string): HTMLElement;

/**
 * Wrap all the node with html and return the wrapped node, and put the wrapper node under the parent of the first node
 * @param nodes The node or node array to wrap
 * @param wrapper The wrapper HTML element, default value is a new DIV element
 * @returns The wrapper element
 */
export default function wrap(nodes: Node | Node[], wrapper?: HTMLElement): HTMLElement;

export default function wrap(
    nodes: Node | Node[],
    wrapper?: CreateElementData | KnownCreateElementDataIndex
): HTMLElement;

export default function wrap(
    nodes: Node | Node[],
    wrapper?: string | HTMLElement | CreateElementData | KnownCreateElementDataIndex
): HTMLElement {
    nodes = !nodes ? [] : safeInstanceOf(nodes, 'Node') ? [nodes] : nodes;
    if (nodes.length == 0 || !nodes[0]) {
        return null;
    }

    if (!wrapper) {
        wrapper = 'div';
    }

    if (!safeInstanceOf(wrapper, 'HTMLElement')) {
        let document = nodes[0].ownerDocument;

        if (typeof wrapper === 'string') {
            wrapper = /^\w+$/.test(wrapper)
                ? document.createElement(wrapper)
                : (fromHtml(wrapper, document)[0] as HTMLElement); // This will be removed in next major release
        } else {
            wrapper = createElement(wrapper, document) as HTMLElement;
        }
    }

    let parentNode = nodes[0].parentNode;

    if (parentNode) {
        parentNode.insertBefore(wrapper, nodes[0]);
    }

    for (let node of nodes) {
        wrapper.appendChild(node);
    }

    return wrapper;
}
