import SelectionRange from '../selection/SelectionRange';
import getComputedStyle from './getComputedStyle';
import getTagOfNode from './getTagOfNode';

export default function changeElementTag(
    element: HTMLElement,
    newTag: string,
    range?: Range
): HTMLElement {
    let selectionRange = range ? new SelectionRange(range).normalize() : null;
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

    if (
        selectionRange &&
        selectionRange.start.node != element &&
        selectionRange.end.node != element
    ) {
        try {
            range.setStart(selectionRange.start.node, selectionRange.start.offset);
            range.setEnd(selectionRange.end.node, selectionRange.end.offset);
        } catch (e) {}
    }

    return newElement;
}
