import { getObjectKeys } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function tempHandleAttributes(element: HTMLElement, attributes: Record<string, string>) {
    getObjectKeys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
}
