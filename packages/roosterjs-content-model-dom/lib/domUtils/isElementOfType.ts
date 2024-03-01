/**
 * Check if the given element is of the type that we are checking according to its tag name
 * @param element The element to check
 * @param tag The HTML tag name to check
 * @returns True if the element has the given tag, otherwise false
 */
export function isElementOfType<Tag extends keyof HTMLElementTagNameMap>(
    element: HTMLElement,
    tag: Tag
): element is HTMLElementTagNameMap[Tag] {
    return element?.tagName?.toLocaleLowerCase() == tag;
}
