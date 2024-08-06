import { getSafeIdSelector } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function ensureUniqueId(element: HTMLElement, idPrefix: string): string {
    idPrefix = element.id || idPrefix;

    const doc = element.ownerDocument;
    let i = 0;

    while (!element.id || doc.querySelectorAll(getSafeIdSelector(element.id)).length > 1) {
        element.id = idPrefix + '_' + i++;
    }

    return element.id;
}
