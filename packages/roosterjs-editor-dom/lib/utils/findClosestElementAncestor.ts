import contains from './contains';
import { NodeType } from 'roosterjs-editor-types';

interface HTMLElementForIE extends HTMLElement {
    msMatchesSelector: (selector: string) => boolean;
}

/**
 * Find closest element ancestor start from the given node which matches the given selector
 * @param node Find ancestor start from this node
 * @param root Root node where the search should stop at. The return value can never be this node
 * @param selector The expected selector. If null, return the first HTML Element found from start node
 * @returns An HTML element which matches the given selector. If the given start node matches the selector,
 * returns the given node
 */
export default function findClosestElementAncestor(
    node: Node,
    root?: Node,
    selector?: string
): HTMLElement {
    node = !node ? null : node.nodeType == NodeType.Element ? node : node.parentNode;
    let element = node && node.nodeType == NodeType.Element ? <HTMLElement>node : null;

    if (element && selector) {
        if (element.closest) {
            element = element.closest(selector) as HTMLElement;
        } else {
            while (
                element &&
                element != root &&
                !(element.matches || (<HTMLElementForIE>element).msMatchesSelector).call(
                    element,
                    selector
                )
            ) {
                element = element.parentElement;
            }
        }
    }

    return !root || contains(root, element) ? element : null;
}
