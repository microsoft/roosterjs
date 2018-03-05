import getComputedStyle from './getComputedStyle';
import getTagOfNode from './getTagOfNode';
import normalizeEditorPoint from './normalizeEditorPoint';
import { EditorPoint } from 'roosterjs-editor-types';

export default function changeElementTag(
    element: HTMLElement,
    newTag: string,
    range?: Range
): HTMLElement {
    let start: EditorPoint;
    let end: EditorPoint;

    if (range) {
        start = normalizeEditorPoint(range.startContainer, range.startOffset);
        end = normalizeEditorPoint(range.endContainer, range.endOffset);
    }

    let newElement = element.ownerDocument.createElement(newTag);

    for (let i = 0; i < element.attributes.length; i++) {
        let attr = element.attributes[i];
        newElement.setAttribute(attr.name, attr.value);
    }

    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }

    if (getTagOfNode(element) == 'P') {
        newElement.style.marginTop = getComputedStyle(element, 'margin-top');
        newElement.style.marginBottom = getComputedStyle(element, 'margin-bottom');
    }

    if (element.parentNode) {
        element.parentNode.replaceChild(newElement, element);
    }

    if (range && start.containerNode != element && end.containerNode != element) {
        try {
            range.setStart(start.containerNode, start.offset);
            range.setEnd(end.containerNode, end.offset);
        } catch (e) {}
    }

    return newElement;
}
