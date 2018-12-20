import getComputedStyles from './getComputedStyles';
import getTagOfNode from './getTagOfNode';

/**
 * Change tag of an HTML Element to a new one, and replace it from DOM tree
 * @param element The element to change tag
 * @param newTag New tag to change to
 * @returns The new element with new tag
 */
export default function changeElementTag<K extends keyof HTMLElementTagNameMap>(
    element: HTMLElement,
    newTag: K
): HTMLElementTagNameMap[K];

/**
 * Change tag of an HTML Element to a new one, and replace it from DOM tree
 * @param element The element to change tag
 * @param newTag New tag to change to
 * @returns The new element with new tag
 */
export default function changeElementTag(element: HTMLElement, newTag: string): HTMLElement;

export default function changeElementTag(element: HTMLElement, newTag: string): HTMLElement {
    if (!element || !newTag) {
        return null;
    }

    let newElement = element.ownerDocument.createElement(newTag);

    for (let i = 0; i < element.attributes.length; i++) {
        let attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }

    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }

    if (getTagOfNode(element) == 'P' || getTagOfNode(newElement) == 'P') {
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
