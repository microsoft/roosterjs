/**
 * Wrap the given node with a new HTML element using the provided tag name
 * @param node The node to wrap
 * @param tag Tag name of the new wrapper
 * @returns The wrapper element we just created
 */
export function wrapWithTag<T extends keyof HTMLElementTagNameMap>(
    node: Node,
    tag: T
): HTMLElementTagNameMap[T] {
    const wrapper = node.ownerDocument!.createElement(tag);

    node.parentNode?.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    return wrapper;
}
