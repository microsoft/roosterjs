import Position from './Position';
import { PositionType } from 'roosterjs-editor-types';

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
export default function createRange(start: Position, end?: Position): Range;

export default function createRange(start: Position | Node, end?: Position | Node): Range {
    if (!start) {
        return null;
    } else if (start instanceof Node) {
        end = new Position(<Node>end || start, PositionType.After);
        start = new Position(start, PositionType.Before);
    } else {
        end = <Position>end || start;
    }

    let range = start.node.ownerDocument.createRange();
    start = start.toFocusablePosition();
    end = end.toFocusablePosition();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);

    return range;
}
