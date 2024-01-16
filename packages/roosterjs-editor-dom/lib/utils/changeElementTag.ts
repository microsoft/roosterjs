import getComputedStyles from './getComputedStyles';
import getTagOfNode from './getTagOfNode';
import moveChildNodes from './moveChildNodes';

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
export default function changeElementTag(element: HTMLElement, newTag: string): HTMLElement | null;

export default function changeElementTag(element: HTMLElement, newTag: string): HTMLElement | null {
    if (!element || !newTag) {
        return null;
    }

    const origianlTag = getTagOfNode(element);

    if (origianlTag == newTag.toUpperCase()) {
        // Already in the target tag, no need to change
        return element;
    }

    const newElement = element.ownerDocument.createElement(newTag);

    for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }

    moveChildNodes(newElement, element);

    if (origianlTag == 'P' || getTagOfNode(newElement) == 'P') {
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
