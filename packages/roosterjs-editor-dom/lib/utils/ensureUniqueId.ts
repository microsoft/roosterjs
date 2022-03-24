import { DocumentOrShadowRoot } from 'roosterjs-editor-types';

/**
 * Ensure the given element has a unique id in its scope
 * @param el The element to check and set id
 * @param idPrefix Prefix of preferred id. If the element already has id, this will be ignored
 */
export default function ensureUniqueId(
    el: HTMLElement,
    idPrefix: string,
    documentOrShadowRoot: DocumentOrShadowRoot
) {
    if (el && !el.id) {
        const getElement = (documentOrShadowRoot: DocumentOrShadowRoot | null) =>
            documentOrShadowRoot?.getElementById(idPrefix + cont);
        let cont = 0;
        //Ensure that there are no elements with the same ID
        let element = getElement(documentOrShadowRoot);

        while (element) {
            element = getElement(documentOrShadowRoot);
            cont++;
        }

        el.id = idPrefix + cont;
    }
}
