import Position from './Position';
import { PositionType } from 'roosterjs-editor-types';

/**
 * Create a Range object with the given Node
 * @param node The node to select;
 */
export default function createRange(node: Node): Range;

/**
 * Create a Range object using start and end position
 * @param start The start position
 * @param end The end position
 */
export default function createRange(start: Position, end?: Position): Range;

export default function createRange(start: Position | Node, end?: Position): Range {
    if (!start) {
        return null;
    } else if (start instanceof Node) {
        end = new Position(start, PositionType.After);
        start = new Position(start, PositionType.Before);
    } else {
        end = end || start;
    }

    let range = start.node.ownerDocument.createRange();
    start = start.toFocusablePosition();
    end = end.toFocusablePosition();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);

    return range;
}
