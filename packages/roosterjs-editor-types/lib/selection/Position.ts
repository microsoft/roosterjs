import NodeType from '../browser/NodeType';

interface Position {
    node: Node;
    offset: number;
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
};

function createPosition(node: Node, offset: number): Position;
function createPosition(node: Node, positionType: PositionType): Position;

function createPosition(node: Node, offsetOrPosType: number | PositionType): Position {
    let offset = 0;
    switch (offsetOrPosType) {
        case PositionType.Before:
            offset = getIndexOfNode(node);
            node = node.parentNode;
            break;

        case PositionType.After:
            offset = getIndexOfNode(node) + 1;
            node = node.parentNode;
            break;

        case PositionType.End:
            offset = getEndOffset(node);
            break;

        default:
            offset = Math.max(0, Math.min(<number>offsetOrPosType, getEndOffset(node)));
            break;
    }

    return {
        node: node,
        offset: offset,
    };
}

function normalize(position: Position) {
    let childCount: number;
    while (
        position.node.nodeType == NodeType.Element &&
        (childCount = position.node.childNodes.length) > 0
    ) {
        let isAtEnd = position.offset >= childCount;
        let child = isAtEnd ? position.node.lastChild : position.node.childNodes[position.offset];
        if (child.nodeType == NodeType.Element) {
            position.node = child;
            position.offset = isAtEnd ? child.childNodes.length : 0;
        } else if (child.nodeType == NodeType.Text) {
            position.node = child;
            position.offset = isAtEnd ? child.nodeValue.length : 0;
            break;
        } else {
            break;
        }
    }
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
