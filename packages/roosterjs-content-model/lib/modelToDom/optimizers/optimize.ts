import { mergeNode } from './mergeNode';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';

/**
 * @internal
 */
export function optimize(root: Node, optimizeLevel: number) {
    if (optimizeLevel >= 1) {
        mergeNode(root);
    }

    if (optimizeLevel >= 2) {
        removeUnnecessarySpan(root);
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child, optimizeLevel);
    }
}
