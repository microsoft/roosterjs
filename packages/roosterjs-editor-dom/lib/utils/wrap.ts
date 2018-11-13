import fromHtml from './fromHtml';

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

export default function wrap(nodes: Node | Node[], wrapper?: string | HTMLElement): HTMLElement {
    nodes = !nodes ? [] : nodes instanceof Node ? [nodes] : nodes;
    if (nodes.length == 0 || !nodes[0]) {
        return null;
    }

    if (!(wrapper instanceof Element)) {
        let document = nodes[0].ownerDocument;
        wrapper = wrapper || 'div';
        wrapper = /^\w+$/.test(wrapper)
            ? document.createElement(wrapper)
            : (fromHtml(wrapper, document)[0] as HTMLElement);
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
