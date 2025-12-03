import { isNodeOfType } from '../../domUtils/isNodeOfType';
import type { RewriteFromModel } from 'roosterjs-content-model-types';

/**
 * @internal
 * Cleans up all rest nodes starting from refNode
 * @param refNode The reference node to start cleaning up
 * @param rewriteContext The context for rewrite process
 */
export function cleanUpRestNodes(refNode: Node | null, rewriteContext: RewriteFromModel) {
    while (refNode) {
        const next = refNode.nextSibling;

        if (refNode.parentNode) {
            if (isNodeOfType(refNode, 'ELEMENT_NODE')) {
                rewriteContext.removedBlockElements.push(refNode);
            }

            refNode.parentNode.removeChild(refNode);
        }

        refNode = next;
    }
}
