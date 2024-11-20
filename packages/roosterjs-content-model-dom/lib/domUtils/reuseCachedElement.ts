import { isEntityElement } from './entityUtils';
import { isNodeOfType } from './isNodeOfType';
import type { DomModification } from 'roosterjs-content-model-types';

/**
 * When set a DOM tree into editor, reuse the existing element in editor and no need to change it
 * @param parent Parent node of the reused element
 * @param element The element to keep in parent node
 * @param refNode Reference node, it is point to current node that is being processed. It must be a child of parent node, or null.
 * We will start processing from this node, if it is not the same with element, remove it and keep processing its next sibling,
 * until we see an element that is the same with the passed in element or null.
 * @returns The new reference element
 */
export function reuseCachedElement(
    parent: Node,
    element: Node,
    refNode: Node | null,
    context?: DomModification
): Node | null {
    if (element.parentNode == parent) {
        const isEntity = isEntityElement(element);

        // Remove nodes before the one we are hitting since they don't appear in Content Model at this position.
        // But we don't want to touch entity since it would better to keep entity at its place unless it is removed
        // In that case we will remove it after we have handled all other nodes
        while (refNode && refNode != element && (isEntity || !isEntityElement(refNode))) {
            const next = refNode.nextSibling;

            refNode.parentNode?.removeChild(refNode);

            if (isNodeOfType(refNode, 'ELEMENT_NODE')) {
                context?.removedBlockElements.push(refNode);
            }

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
