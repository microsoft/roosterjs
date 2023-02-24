import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

const OptimizeTags = ['SPAN', 'B', 'EM', 'I', 'U', 'SUB', 'SUP', 'STRIKE', 'S', 'A', 'CODE'];

/**
 * @internal
 */
export function mergeNode(root: Node) {
    for (let child = root.firstChild; child; ) {
        const next = child.nextSibling;

        if (
            next &&
            isNodeOfType(child, NodeType.Element) &&
            isNodeOfType(next, NodeType.Element) &&
            child.tagName == next.tagName &&
            OptimizeTags.indexOf(child.tagName) >= 0 &&
            hasSameAttributes(child, next)
        ) {
            while (next.firstChild) {
                child.appendChild(next.firstChild);
            }

            next.parentNode!.removeChild(next);
        } else {
            child = next;
        }
    }
}

function hasSameAttributes(element1: HTMLElement, element2: HTMLElement) {
    const attr1 = element1.attributes;
    const attr2 = element2.attributes;

    if (attr1.length != attr2.length) {
        return false;
    }

    for (let i = 0; i < attr1.length; i++) {
        if (attr1[i].name != attr2[i].name || attr1[i].value != attr2[i].value) {
            return false;
        }
    }

    return true;
}
