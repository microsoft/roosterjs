import { isNodeOfType } from 'roosterjs-content-model-dom';
import { Pos } from '../../coreApi/restoreUndoSnapshot/getPositionFromPath';

/**
 * @internal
 */
export function normalizePos(node: Node, offset: number): Pos {
    const len = isNodeOfType(node, 'TEXT_NODE')
        ? node.nodeValue?.length ?? 0
        : node.childNodes.length;
    offset = Math.max(Math.min(offset, len), 0);

    while (node?.lastChild) {
        if (offset >= node.childNodes.length) {
            node = node.lastChild;
            offset = isNodeOfType(node, 'TEXT_NODE')
                ? node.nodeValue?.length ?? 0
                : node.childNodes.length;
        } else {
            node = node.childNodes[offset];
            offset = 0;
        }
    }

    return { node, offset };
}
