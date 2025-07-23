/**
 * @internal
 * Export for testing purpose only. This will create a cloned root element for testing purpose
 */
export function createClonedRoot() {
    return document.implementation.createHTMLDocument('').body;
}
