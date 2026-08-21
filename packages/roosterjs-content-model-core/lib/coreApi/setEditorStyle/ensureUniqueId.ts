import { getSafeIdSelector } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function ensureUniqueId(element: HTMLElement, idPrefix: string): string {
    idPrefix = element.id || idPrefix;

    const root = element.getRootNode() as Document | ShadowRoot;
    let i = 0;

    while (!element.id || root.querySelectorAll(getSafeIdSelector(element.id)).length > 1) {
        element.id = idPrefix + '_' + i++;
    }

    return element.id;
}
