import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import Position from './Position';
import { NodePosition, NodeType, PositionType, SelectionPath } from 'roosterjs-editor-types';

/**
 * Create a range around the given node(s)
 * @param startNode The start node to create range from
 * @param endNode The end node to create range from. If specified, the range will start before startNode and
 * end after endNode, otherwise, the range will start before and end after the start node
 * @returns A range start before the given node and end after the given node
 */
export default function createRange(startNode: Node, endNode?: Node): Range;

/**
 * Create a collapsed range at the given node and offset
 * @param node The container node of the range
 * @param offset The offset of the range, can be a number or value of PositionType
 * @returns A range at the given node and offset
 */
export default function createRange(node: Node, offset: number | PositionType): Range;

/**
 * Create a range with the given start/end container node and offset
 * @param startNode The start container node of the range
 * @param startOffset The start offset of the range
 * @param endNode The end container node of the range
 * @param endOffset The end offset of the range
 * @returns A range at the given start/end container node and offset
 */
export default function createRange(
    startNode: Node,
    startOffset: number | PositionType,
    endNode: Node,
    endOffset: number | PositionType
): Range;

/**
 * Create a range under the given rootNode with start and end selection paths
 * @param rootNode The root node that the selection paths start from
 * @param startPath The selection path of the start position of the range
 * @param endPath The selection path of the end position of the range
 * @returns A range with the given start and end selection paths
 */
export default function createRange(rootNode: Node, startPath: number[], endPath?: number[]): Range;

/**
 * Create a range with the start and end position
 * @param startPosition The start position of the range
 * @param endPosition The end position of the range, if not specified, the range will be collapsed at start position
 * @returns A range start at startPosition, end at endPosition, or startPosition when endPosition is not specified
 */
export default function createRange(startPosition: NodePosition, endPosition?: NodePosition): Range;

export default function createRange(
    arg1: Node | NodePosition,
    arg2?: number | number[] | Node | NodePosition,
    arg3?: Node | number[],
    arg4?: number
): Range {
    let start: NodePosition;
    let end: NodePosition;

    if (isNodePosition(arg1)) {
        // function createRange(startPosition: NodePosition, endPosition?: NodePosition): Range;
        start = arg1;
        end = isNodePosition(arg2) ? arg2 : null;
    } else if (arg1 instanceof Node) {
        if (arg2 instanceof Array) {
            // function createRange(rootNode: Node, startPath: number[], endPath?: number[]): Range;
            start = getPositionFromPath(arg1, arg2);
            end = arg3 instanceof Array ? getPositionFromPath(arg1, arg3) : null;
        } else if (typeof arg2 == 'number') {
            // function createRange(node: Node, offset: number | PositionType): Range;
            // function createRange(startNode: Node, startOffset: number | PositionType, endNode: Node, endOffset: number | PositionType): Range;
            start = new Position(arg1, arg2);
            end = arg3 instanceof Node ? new Position(arg3, arg4) : null;
        } else if (arg2 instanceof Node || !arg2) {
            // function createRange(startNode: Node, endNode?: Node): Range;
            start = new Position(arg1, PositionType.Before);
            end = new Position(<Node>arg2 || arg1, PositionType.After);
        }
    }

    if (start) {
        let range = start.node.ownerDocument.createRange();
        start = getFocusablePosition(start);
        end = getFocusablePosition(end || start);
        range.setStart(start.node, start.offset);
        range.setEnd(end.node, end.offset);

        return range;
    } else {
        return null;
    }
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

function isNodePosition(arg: any): arg is NodePosition {
    return arg && arg.node;
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
 * @deprecated Use createRange instead
 * Get range from the given selection path
 * @param rootNode Root node of the selection path
 * @param path The selection path which contains start and end position path
 */
export function getRangeFromSelectionPath(rootNode: HTMLElement, path: SelectionPath) {
    return createRange(rootNode, path.start, path.end);
}
