/**
 * Replace all child nodes of the given target node to the child nodes of source node.
 * @param target Target node, all child nodes of this node will be removed if keepExistingChildren is not set to true
 * @param source (Optional) source node, all child nodes of this node will be move to target node
 * @param keepExistingChildren (Optional) When set to true, all existing child nodes of target will be kept
 */
export function moveChildNodes(target: Node, source?: Node, keepExistingChildren?: boolean) {
    if (!target) {
        return;
    }

    while (!keepExistingChildren && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    while (source?.firstChild) {
        target.appendChild(source.firstChild);
    }
}

/**
 * Wrap all child nodes of the given parent element using a new element with the given tag name
 * @param parent The parent element
 * @param tagName The tag name of new wrapper
 * @returns New wrapper element
 */
export function wrapAllChildNodes<T extends keyof HTMLElementTagNameMap>(
    parent: HTMLElement,
    tagName: T
): HTMLElementTagNameMap[T] {
    const newElement = parent.ownerDocument.createElement(tagName);

    moveChildNodes(newElement, parent);
    parent.appendChild(newElement);

    return newElement;
}
