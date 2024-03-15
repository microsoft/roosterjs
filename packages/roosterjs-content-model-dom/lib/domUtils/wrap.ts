/**
 * Wrap the given node with a new element, put the wrapper node under the parent of the first node
 * and return the wrapper element.
 * @param doc Parent document object
 * @param node The node to wrap
 * @param wrapperTag The tag of wrapper HTML element
 * @returns The wrapper element
 */
export function wrap<T extends keyof HTMLElementTagNameMap>(
    doc: Document,
    node: Node,
    wrapperTag: T
): HTMLElementTagNameMap[T] {
    const wrapper = doc.createElement(wrapperTag);
    node.parentNode?.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    return wrapper;
}
