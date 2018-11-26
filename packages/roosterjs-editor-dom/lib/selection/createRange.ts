import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import Position from './Position';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';

/**
 * Create a Range object with the given Node(s)
 * @param node The node to select
 * @param endNode The optional end node to select. When specified, range will start before the node and end after endNode
 */
export default function createRange(node: Node, endNode?: Node): Range;

/**
 * Create a Range object using start and end position
 * @param start The start position
 * @param end The end position
 */
export default function createRange(start: NodePosition, end?: NodePosition): Range;

/**
 * Create a Range object using start and end node indexes and rootNode
 * @param start The start position path
 * @param end The end position path
 * @param rootNode The root node of the path
 */
export default function createRange(start: number[], end: number[], rootNode: HTMLElement): Range;

export default function createRange(
    start: NodePosition | Node | number[],
    end?: NodePosition | Node | number[],
    rootNode?: HTMLElement
): Range {
    if (!start) {
        return null;
    } else if (start instanceof Array) {
        start = getPositionFromPath(rootNode, start);
        end = getPositionFromPath(rootNode, end as number[]);
    } else if (start instanceof Node) {
        end = new Position(<Node>end || start, PositionType.After);
        start = new Position(start, PositionType.Before);
    } else {
        end = <Position>end || start;
    }

    let range = start.node.ownerDocument.createRange();
    start = getFocusablePosition(start);
    end = getFocusablePosition(end);
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);

    return range;
}

function getPositionFromPath(node: Node, path: number[]): NodePosition {
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
 * Convert to focusable position
 * If current node is a void element, we need to move up one level to put cursor outside void element
 */
function getFocusablePosition(position: NodePosition) {
    return position.node.nodeType == NodeType.Element && isVoidHtmlElement(position.node)
        ? new Position(position.node, position.isAtEnd ? PositionType.After : PositionType.Before)
        : position;
}
