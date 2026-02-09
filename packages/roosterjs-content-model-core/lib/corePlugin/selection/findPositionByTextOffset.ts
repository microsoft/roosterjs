import { isNodeOfType } from 'roosterjs-content-model-dom';
import { normalizePos } from './normalizePos';
import type { DOMInsertPoint } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function findPositionByTextOffset(
    doc: Document,
    nodeElement: Node,
    targetOffset: number
): DOMInsertPoint {
    const walker = doc.createTreeWalker(nodeElement, NodeFilter.SHOW_TEXT);

    if (walker) {
        let accumulatedLength = 0;
        let node: Node | null;

        while ((node = walker.nextNode())) {
            if (isNodeOfType(node, 'TEXT_NODE')) {
                const nodeLength = node.length;

                if (accumulatedLength + nodeLength >= targetOffset) {
                    return { node, offset: targetOffset - accumulatedLength };
                }
                accumulatedLength += nodeLength;
            }
        }

        if (isNodeOfType(walker.currentNode, 'TEXT_NODE')) {
            return { node: walker.currentNode, offset: walker.currentNode.length };
        }
    }

    return normalizePos(nodeElement, 0);
}
