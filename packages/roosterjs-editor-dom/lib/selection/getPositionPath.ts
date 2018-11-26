import { NodePosition, NodeType } from 'roosterjs-editor-types';
import contains from '../utils/contains';

/**
 * Recursively get the path of the node relative to rootNode.
 * The path of the node is an array of integer indecies into the childNodes of the given node.
 *
 * The node path will be what the node path will be on a _normalized_ dom
 * (e.g. empty text nodes will be ignored and adjacent text nodes will be concatenated)
 *
 * @param rootNode the node the path will be relative to
 * @param position the position to get indexes from. Follows the same semantics
 * as selectionRange (if node is of type Text, it is an offset into the text of that node.
 * If node is of type Element, it is the index of a child in that Element node.)
 */
export default function getPositionPath(position: NodePosition, rootNode: HTMLElement): number[] {
    if (!position || !rootNode) {
        return [];
    }

    let { node, offset } = position;
    let result: number[] = [];
    let parent: Node;

    if ((node == rootNode && !node.firstChild) || !contains(rootNode, node, true)) {
        return [];
    }

    if (node.nodeType == NodeType.Text) {
        parent = node.parentNode;
        while (node.previousSibling && node.previousSibling.nodeType == NodeType.Text) {
            offset += node.previousSibling.nodeValue.length;
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

        for (let c: Node = parent.firstChild; c && c != node; c = c.nextSibling) {
            if (c.nodeType == NodeType.Text) {
                if (c.nodeValue.length == 0 || isPreviousText) {
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
        parent = parent.parentNode;
    } while (node && node != rootNode);

    return result;
}
