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
 * @param start The start position node index array
 * @param end The end position node index array
 * @param rootNode The root node of the indexes
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
        start = getContainerAndOffset(rootNode, start);
        end = getContainerAndOffset(rootNode, end as number[]);
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

function getContainerAndOffset(node: Node, path: number[]): NodePosition {
    let container: Node = node;
    // Iterate with a for loop to avoid mutating the passed in element path stack
    // or needing to copy it.
    for (let i = 0; i < path.length - 1; i++) {
        if (container instanceof Element) {
            if (container.childNodes.length <= path[i]) {
                // TODO log an error here.
                // We tried to walk past the end of a container.
                throw new Error('Tried to step past end of container during selection restoration');
            }
            container = container.childNodes[path[i]];
        } else if (container instanceof Text) {
            // TODO log a warning here. We hit a text element before the end of the path
            throw new Error('Hit Text node before end of path');
        }
    }

    return new Position(container, path[path.length - 1]);
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
