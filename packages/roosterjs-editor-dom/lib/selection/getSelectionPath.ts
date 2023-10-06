import contains from '../utils/contains';
import Position from './Position';
import { NodeType } from 'roosterjs-editor-types';
import type { NodePosition, SelectionPath } from 'roosterjs-editor-types';

/**
 * Get path of the given selection range related to the given rootNode
 * @param rootNode The root node where the path start from
 * @param range The range of selection
 */
export default function getSelectionPath(
    rootNode: Node,
    range: Range | null
): SelectionPath | null {
    if (!range) {
        return null;
    }

    let selectionPath: SelectionPath = {
        start: getPositionPath(Position.getStart(range), rootNode),
        end: getPositionPath(Position.getEnd(range), rootNode),
    };

    return selectionPath;
}

/**
 * Get the path of the node relative to rootNode.
 * The path of the node is an array of integer indices into the childNodes of the given node.
 *
 * The node path will be what the node path will be on a _normalized_ dom
 * (e.g. empty text nodes will be ignored and adjacent text nodes will be concatenated)
 *
 * @param rootNode the node the path will be relative to
 * @param position the position to get indexes from. Follows the same semantics
 * as selectionRange (if node is of type Text, it is an offset into the text of that node.
 * If node is of type Element, it is the index of a child in that Element node.)
 */
function getPositionPath(position: NodePosition, rootNode: Node): number[] {
    if (!position || !rootNode) {
        return [];
    }

    let node: Node | null = position.node;
    let offset = position.offset;
    let result: number[] = [];
    let parent: Node | null;

    if (!contains(rootNode, node, true)) {
        return [];
    }

    if (node.nodeType == NodeType.Text) {
        parent = node.parentNode;
        while (node.previousSibling && node.previousSibling.nodeType == NodeType.Text) {
            offset += node.previousSibling.nodeValue?.length || 0;
            node = node.previousSibling;
        }
        result.unshift(offset);
    } else {
        parent = node;
        node = node.childNodes[offset];
    }

    do {
        offset = 0;
        let isPreviousText = false;

        for (let c: Node | null = parent?.firstChild || null; c && c != node; c = c.nextSibling) {
            if (c.nodeType == NodeType.Text) {
                if (c.nodeValue?.length === 0 || isPreviousText) {
                    continue;
                }

                isPreviousText = true;
            } else {
                isPreviousText = false;
            }

            offset++;
        }

        result.unshift(offset);
        node = parent;
        parent = parent?.parentNode || null;
    } while (node && node != rootNode);

    return result;
}
