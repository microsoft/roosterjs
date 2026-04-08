/**
 * @internal
 * Remove all forbidden elements from a parsed HTML document
 * @param doc The parsed HTML document to clean
 * @param forbiddenElements Array of tag names to remove (e.g., ['iframe', 'script'])
 */
export function cleanForbiddenElements(doc: Document, forbiddenElements: string[]): void {
    if (forbiddenElements.length === 0) {
        return;
    }

    const selector = forbiddenElements.join(',');
    const elements = Array.from(doc.body.querySelectorAll(selector));

    for (const element of elements) {
        element.parentNode?.removeChild(element);
    }
}
