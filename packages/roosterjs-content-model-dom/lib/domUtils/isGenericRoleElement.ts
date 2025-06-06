// List of elements that have generic roles by default
const genericRoleElements = new Set([
    'div',
    'span',
    'p',
    'section',
    'article',
    'aside',
    'header',
    'footer',
    'main',
    'nav',
    'address',
    'blockquote',
    'pre',
    'figure',
    'figcaption',
    'hgroup',
]);

/**
 * @internal
 */
export function isGenericRoleElement(element: Element | null): element is Element {
    if (!element) {
        return false;
    }

    const tagName = element.tagName.toLowerCase();

    return genericRoleElements.has(tagName);
}
