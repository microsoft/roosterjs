import { getEntityFromElement } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function reuseCachedElement(parent: Node, element: Node, refNode: Node | null): Node | null {
    if (element.parentNode == parent) {
        // Remove nodes before the one we are hitting since they don't appear in Content Model at this position.
        // But we don't want to touch entity since it would better to keep entity at its place unless it is removed
        // In that case we will remove it after we have handled all other nodes
        while (refNode && refNode != element && !isEntity(refNode)) {
            const next = refNode.nextSibling;

            refNode.parentNode?.removeChild(refNode);
            refNode = next;
        }

        if (refNode && refNode == element) {
            refNode = refNode.nextSibling;
        } else {
            parent.insertBefore(element, refNode);
        }
    } else {
        parent.insertBefore(element, refNode);
    }

    return refNode;
}

/**
 * @internal
 */
export function removeNode(node: Node): Node | null {
    const next = node.nextSibling;
    node.parentNode?.removeChild(node);

    return next;
}

function isEntity(node: Node) {
    return isNodeOfType(node, NodeType.Element) && !!getEntityFromElement(node);
}
