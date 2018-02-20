import NodeType from '../browser/NodeType';
import DocumentPosition from '../browser/DocumentPosition';

interface Position {
    readonly node: Node;
    readonly offset: number;
    readonly isAtEnd: boolean;
}

export const enum PositionType {
    Before = 'b',
    Begin = 0,
    End = 'e',
    After = 'a',
}

const Position = {
    Before: PositionType.Before,
    Begin: PositionType.Begin,
    End: PositionType.End,
    After: PositionType.After,
    create: createPosition,
    normalize: normalize,
    equal: equal,
    isAfter: isAfter,
};

/**
 * Clone and validate a position from existing position.
 * If the given position has invalid offset, this function will return a corrected value.
 * @param position The original position to clone from
 */
function createPosition(position: Position): Position;

/**
 * Create a Position from node and an offset number
 * @param node The node of this position
 * @param offset Offset of this position
 */
function createPosition(node: Node, offset: number): Position;

/**
 * Create a Position from node and a type of position
 * @param node The node of this position
 * @param positionType Type of the postion, can be Begin, End, Before, After
 */
function createPosition(node: Node, positionType: PositionType): Position;

function createPosition(
    nodeOrPosition: Node | Position,
    offsetOrPosType?: number | PositionType
): Position {
    let offset = 0;
    let isAtEnd: boolean;
    let node: Node;

    if ((<Position>nodeOrPosition).node) {
        node = (<Position>nodeOrPosition).node;
        offsetOrPosType = (<Position>nodeOrPosition).offset;
    } else {
        node = <Node>nodeOrPosition;
    }

    switch (offsetOrPosType) {
        case PositionType.Before:
            offset = getIndexOfNode(node);
            node = node.parentNode;
            isAtEnd = false;
            break;

        case PositionType.After:
            offset = getIndexOfNode(node) + 1;
            isAtEnd = !node.nextSibling;
            node = node.parentNode;
            break;

        case PositionType.End:
            offset = getEndOffset(node);
            isAtEnd = true;
            break;

        default:
            let endOffset = getEndOffset(node);
            offset = Math.max(0, Math.min(<number>offsetOrPosType, endOffset));
            isAtEnd = offsetOrPosType == PositionType.End || (offset > 0 && offset == endOffset);
            break;
    }

    return {
        node: node,
        offset: offset,
        isAtEnd: isAtEnd,
    };
}

function normalize(position: Position): Position {
    let { node, offset, isAtEnd } = position;
    let newOffset: number | PositionType.Begin | PositionType.End = isAtEnd
        ? PositionType.End
        : offset;
    while (node.nodeType == NodeType.Element && node.firstChild) {
        node =
            newOffset == PositionType.Begin
                ? node.firstChild
                : newOffset == PositionType.End
                  ? node.lastChild
                  : node.childNodes[<number>newOffset];
        newOffset = isAtEnd ? PositionType.End : PositionType.Begin;
    }
    return createPosition(node, newOffset);
}

function equal(p1: Position, p2: Position): boolean {
    return p1 == p2 || (p1.node == p2.node && p1.offset == p2.offset);
}

/**
 * Checks if position 1 is after position 2
 */
function isAfter(position1: Position, position2: Position): boolean {
    return position1.node == position2.node
        ? position1.offset > position2.offset
        : (position2.node.compareDocumentPosition(position1.node) & DocumentPosition.Following) ==
              DocumentPosition.Following;
}

function getIndexOfNode(node: Node): number {
    let i = 0;
    while ((node = node.previousSibling)) {
        i++;
    }
    return i;
}

function getEndOffset(node: Node): number {
    if (node.nodeType == NodeType.Text) {
        return node.nodeValue.length;
    } else if (node.nodeType == NodeType.Element) {
        return node.childNodes.length;
    } else {
        return 1;
    }
}

export default Position;
