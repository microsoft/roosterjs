import { mergeNode } from './mergeNode';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';

/**
 * @internal
 */
export function optimize(root: Node) {
    removeUnnecessarySpan(root);
    mergeNode(root);

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child);
    }
}
