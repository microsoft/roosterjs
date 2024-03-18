/**
 * @internal
 */
export function ensureUniqueId(element: HTMLElement, idPrefix: string): string {
    idPrefix = element.id || idPrefix;

    const doc = element.ownerDocument;
    let i = 0;

    while (!element.id || doc.querySelectorAll('#' + element.id).length > 1) {
        element.id = idPrefix + '_' + i++;
    }

    return element.id;
}
