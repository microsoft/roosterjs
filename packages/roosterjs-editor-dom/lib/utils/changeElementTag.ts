import getComputedStyle from './getComputedStyle';
import getTagOfNode from './getTagOfNode';

/**
 * Change tag of ab HTML Element to a new one, and replace it from DOM tree
 * @param element The element to change tag
 * @param newTag New tag to change to
 * @returns The new Node with new tag
 */
export default function changeElementTag(element: HTMLElement, newTag: string): HTMLElement {
    let newElement = element.ownerDocument.createElement(newTag);

    for (let i = 0; i < element.attributes.length; i++) {
        let attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }

    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }

    if (getTagOfNode(element) == 'P') {
        let styles = getComputedStyle(element, ['margin-top', 'margin-bottom']);
        newElement.style.marginTop = styles[0];
        newElement.style.marginBottom = styles[1];
    }

    if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
    }

    return newElement;
}
