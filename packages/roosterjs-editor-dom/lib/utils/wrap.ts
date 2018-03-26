import fromHtml from './fromHtml';

/**
 * Wrap all the node with html and return the wrapped node, and put the wrapper node under the parent of the first node
 * @param nodes The node or node array to wrap
 * @param wrapper The wrapper node or HTML string, default value is <div></div>
 * @param sanitize Whether do sanitization of wrapper string before create node to avoid XSS,
 * default value is false
 * @returns The wrapper element
 */
export default function wrap(
    nodes: Node | Node[],
    wrapper?: string | HTMLElement,
    sanitize?: boolean
): HTMLElement {
    nodes = !nodes ? [] : nodes instanceof Node ? [nodes] : nodes;
    if (nodes.length == 0 || !nodes[0]) {
        return null;
    }

    wrapper =
        wrapper instanceof Element
            ? wrapper
            : fromHtml(wrapper || '<div></div>', nodes[0].ownerDocument, sanitize)[0] as HTMLElement;
    let parentNode = nodes[0].parentNode;

    if (parentNode) {
        parentNode.insertBefore(wrapper, nodes[0]);
    }

    for (let node of nodes) {
        wrapper.appendChild(node);
    }

    return wrapper;
}
