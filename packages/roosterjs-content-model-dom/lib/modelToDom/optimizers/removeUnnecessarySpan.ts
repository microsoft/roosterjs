import { isNodeOfType } from '../../domUtils/isNodeOfType';

/**
 * @internal
 */
export function removeUnnecessarySpan(root: Node) {
    for (let child = root.firstChild; child; ) {
        if (
            isNodeOfType(child, 'ELEMENT_NODE') &&
            child.tagName == 'SPAN' &&
            child.attributes.length == 0
        ) {
            const node = child;
            let refNode = child.nextSibling;
            child = child.nextSibling;

            while (node.lastChild) {
                const newNode = node.lastChild;
                root.insertBefore(newNode, refNode);
                refNode = newNode;
            }

            root.removeChild(node);
        } else {
            child = child.nextSibling;
        }
    }
}
