import { EntityClasses } from 'roosterjs-editor-types';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { mergeNode } from './mergeNode';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';

/**
 * @internal
 */
export function optimize(root: Node) {
    /**
     * Do no do any optimization to entity
     */
    if (
        isNodeOfType(root, 'ELEMENT_NODE') &&
        root.classList.contains(EntityClasses.ENTITY_INFO_NAME)
    ) {
        return;
    }

    removeUnnecessarySpan(root);
    mergeNode(root);

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child);
    }
}
