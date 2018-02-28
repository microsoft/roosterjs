import { NodeType } from 'roosterjs-editor-types';
import PositionType from './PositionType';
import isNodeAfter from '../utils/isNodeAfter';

export default class Position {
    static readonly Before = PositionType.Before;
    static readonly Begin = PositionType.Begin;
    static readonly End = PositionType.End;
    static readonly After = PositionType.After;

    readonly node: Node;
    readonly offset: number;
    readonly isAtEnd: boolean;

    /**
     * Clone and validate a position from existing position.
     * If the given position has invalid offset, this function will return a corrected value.
     * @param position The original position to clone from
     */
    constructor(position: Position);

    /**
     * Create a Position from node and an offset number
     * @param node The node of this position
     * @param offset Offset of this position
     */
    constructor(node: Node, offset: number);

    /**
     * Create a Position from node and a type of position
     * @param node The node of this position
     * @param positionType Type of the postion, can be Begin, End, Before, After
     */
    constructor(node: Node, positionType: PositionType);

    constructor(nodeOrPosition: Node | Position, offsetOrPosType?: number | PositionType) {
        if ((<Position>nodeOrPosition).node) {
            this.node = (<Position>nodeOrPosition).node;
            offsetOrPosType = (<Position>nodeOrPosition).offset;
        } else {
            this.node = <Node>nodeOrPosition;
        }

        switch (offsetOrPosType) {
            case PositionType.Before:
                this.offset = getIndexOfNode(this.node);
                this.node = this.node.parentNode;
                this.isAtEnd = false;
                break;

            case PositionType.After:
                this.offset = getIndexOfNode(this.node) + 1;
                this.isAtEnd = !this.node.nextSibling;
                this.node = this.node.parentNode;
                break;

            case PositionType.End:
                this.offset = getEndOffset(this.node);
                this.isAtEnd = true;
                break;

            default:
                let endOffset = getEndOffset(this.node);
                this.offset = Math.max(0, Math.min(<number>offsetOrPosType, endOffset));
                this.isAtEnd =
                    offsetOrPosType == PositionType.End ||
                    (this.offset > 0 && this.offset == endOffset);
                break;
        }
    }

    normalize(): Position {
        if (this.node.nodeType == NodeType.Text || !this.node.firstChild) {
            return this;
        }

        let node = this.node;
        let newOffset: number | PositionType.Begin | PositionType.End = this.isAtEnd
            ? PositionType.End
            : this.offset;
        while (node.nodeType == NodeType.Element && node.firstChild) {
            node =
                newOffset == PositionType.Begin
                    ? node.firstChild
                    : newOffset == PositionType.End
                      ? node.lastChild
                      : node.childNodes[<number>newOffset];
            newOffset = this.isAtEnd ? PositionType.End : PositionType.Begin;
        }
        return new Position(node, newOffset);
    }

    equalTo(p: Position): boolean {
        return this == p || (this.node == p.node && this.offset == p.offset);
    }

    /**
     * Checks if position 1 is after position 2
     */
    isAfter(p: Position): boolean {
        return this.node == p.node ? this.offset > p.offset : isNodeAfter(this.node, p.node);
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
