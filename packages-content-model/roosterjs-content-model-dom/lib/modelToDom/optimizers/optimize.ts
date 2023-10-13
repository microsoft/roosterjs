import { isEntityElement } from '../../domUtils/entityUtils';
import { mergeNode } from './mergeNode';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';

/**
 * @internal
 */
export function optimize(root: Node) {
    /**
     * Do no do any optimization to entity
     */
    if (isEntityElement(root)) {
        return;
    }

    removeUnnecessarySpan(root);
    mergeNode(root);

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child);
    }
}
