import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function removeUnnecessarySpan(root: Node) {
    for (let child = root.firstChild; child; ) {
        if (
            isNodeOfType(child, NodeType.Element) &&
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
