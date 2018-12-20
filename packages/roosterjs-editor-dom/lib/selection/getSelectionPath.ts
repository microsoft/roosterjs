import contains from '../utils/contains';
import createRange from './createRange';
import Position from './Position';
import { NodePosition, NodeType, SelectionPath } from 'roosterjs-editor-types';

/**
 * Get path of the given selection range related to the given rootNode
 * @param rootNode The root node where the path start from
 * @param range The range of selection
 */
export default function getSelectionPath(rootNode: HTMLElement, range: Range): SelectionPath {
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
 * Get range from the given selection path
 * @param rootNode Root node of the selection path
 * @param path The selection path which contains start and end position path
 */
export function getRangeFromSelectionPath(rootNode: HTMLElement, path: SelectionPath) {
    let start = getPositionFromPath(rootNode, path.start);
    let end = getPositionFromPath(rootNode, path.end);
    return createRange(start, end);
}

function getPositionFromPath(node: Node, path: number[]): NodePosition {
    if (!node || !path) {
        return null;
    }

    // Iterate with a for loop to avoid mutating the passed in element path stack
    // or needing to copy it.
    let offset: number;

    for (let i = 0; i < path.length; i++) {
        offset = path[i];
        if (
            i < path.length - 1 &&
            node &&
            node.nodeType == NodeType.Element &&
            node.childNodes.length > offset
        ) {
            node = node.childNodes[offset];
        } else {
            break;
        }
    }

    return new Position(node, offset);
}

/**
 * Get the path of the node relative to rootNode.
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
function getPositionPath(position: NodePosition, rootNode: HTMLElement): number[] {
    if (!position || !rootNode) {
        return [];
    }

    let { node, offset } = position;
    let result: number[] = [];
    let parent: Node;

    if (!contains(rootNode, node, true)) {
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
