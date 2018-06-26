import getTagOfNode from './getTagOfNode';
import { getComputedStyles } from './getComputedStyle';

/**
 * Change tag of ab HTML Element to a new one, and replace it from DOM tree
 * @param element The element to change tag
 * @param newTag New tag to change to
 * @returns The new element with new tag
 */
export default function changeElementTag<K extends keyof HTMLElementTagNameMap>(
    element: HTMLElement,
    newTag: K,
    deprecated?: any
): HTMLElementTagNameMap[K] {
    let newElement = element.ownerDocument.createElement(newTag);

    for (let i = 0; i < element.attributes.length; i++) {
        let attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }

    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }

    if (getTagOfNode(element) == 'P') {
        [newElement.style.marginTop, newElement.style.marginBottom] = getComputedStyles(element, [
            'margin-top',
            'margin-bottom',
        ]);
    }

    if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
    }

    return newElement;
}
