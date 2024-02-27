/**
 * @internal
 */
export function getRootComputedStyle(document: Document) {
    const rootComputedStyle = document.defaultView?.getComputedStyle(document.documentElement);
    return rootComputedStyle;
}
