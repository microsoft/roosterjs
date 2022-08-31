import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import isNodeAfter from '../utils/isNodeAfter';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';
import type { CompatiblePositionType } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Represent a position in DOM tree by the node and its offset index
 */
export default class Position implements NodePosition {
    readonly node: Node;
    readonly element: HTMLElement;
    readonly offset: number;
    readonly isAtEnd: boolean;

    /**
     * Clone and validate a position from existing position.
     * If the given position has invalid offset, this function will return a corrected value.
     * @param position The original position to clone from
     */
    constructor(position: NodePosition);

    /**
     * Create a Position from node and an offset number
     * @param node The node of this position
     * @param offset Offset of this position
     * @param isFromEndOfRange Whether this position is created from end of a range. An position
     * created from end of range has different behavior when normalize, it will use the child node
     * before current position if any as a deeper level node and set isAtEnd to true.
     */
    constructor(node: Node, offset: number, isFromEndOfRange?: boolean);

    /**
     * Create a Position from node and a type of position
     * @param node The node of this position
     * @param positionType Type of the position, can be Begin, End, Before, After
     */
    constructor(node: Node, positionType: PositionType | CompatiblePositionType);

    constructor(
        nodeOrPosition: Node | NodePosition,
        offsetOrPosType: number = 0,
        private readonly isFromEndOfRange?: boolean
    ) {
        if ((<NodePosition>nodeOrPosition).node) {
            this.node = (<NodePosition>nodeOrPosition).node;
            offsetOrPosType = (<NodePosition>nodeOrPosition).offset;
        } else {
            this.node = <Node>nodeOrPosition;
        }

        switch (offsetOrPosType) {
            case PositionType.Before:
                this.offset = getIndexOfNode(this.node);
                this.node = this.node.parentNode!; // TODO: how to handle parentNode is null?
                this.isAtEnd = false;
                break;

            case PositionType.After:
                this.offset = getIndexOfNode(this.node) + 1;
                this.isAtEnd = !this.node.nextSibling;
                this.node = this.node.parentNode!; // TODO: how to handle parentNode is null?
                break;

            case PositionType.End:
                this.offset = getEndOffset(this.node);
                this.isAtEnd = true;
                break;

            default:
                let endOffset = getEndOffset(this.node);
                this.offset = Math.max(0, Math.min(<number>offsetOrPosType, endOffset));
                this.isAtEnd = offsetOrPosType > 0 && offsetOrPosType >= endOffset;
                break;
        }

        this.element = findClosestElementAncestor(this.node)!; // TODO: how to handle parent element is null?
    }

    /**
     * Normalize this position to the leaf node, return the normalize result.
     * If current position is already using leaf node, return this position object itself
     */
    normalize(): NodePosition {
        if (this.node.nodeType == NodeType.Text || !this.node.firstChild) {
            return this;
        }

        let node = this.node;
        let newOffset: number | PositionType.Begin | PositionType.End = this.isAtEnd
            ? PositionType.End
            : this.offset;
        while (node.nodeType == NodeType.Element || node.nodeType == NodeType.DocumentFragment) {
            const nextNode = this.isFromEndOfRange
                ? newOffset == PositionType.End
                    ? node.lastChild
                    : node.childNodes[<number>newOffset - 1]
                : newOffset == PositionType.Begin
                ? node.firstChild
                : newOffset == PositionType.End
                ? node.lastChild
                : node.childNodes[<number>newOffset];

            if (nextNode) {
                node = nextNode;
                newOffset =
                    this.isAtEnd || this.isFromEndOfRange ? PositionType.End : PositionType.Begin;
            } else {
                break;
            }
        }
        return new Position(node, newOffset, this.isFromEndOfRange);
    }

    /**
     * Check if this position is equal to the given position
     * @param position The position to check
     */
    equalTo(position: NodePosition): boolean {
        return (
            position &&
            (this == position ||
                (this.node == position.node &&
                    this.offset == position.offset &&
                    this.isAtEnd == position.isAtEnd))
        );
    }

    /**
     * Checks if this position is after the given position
     */
    isAfter(position: NodePosition): boolean {
        return this.node == position.node
            ? (this.isAtEnd && !position.isAtEnd) || this.offset > position.offset
            : isNodeAfter(this.node, position.node);
    }

    /**
     * Move this position with offset, returns a new position with a valid offset in the same node
     * @param offset Offset to move with
     */
    move(offset: number) {
        return new Position(this.node, Math.max(this.offset + offset, 0));
    }

    /**
     * Get start position of the given Range
     * @param range The range to get position from
     */
    static getStart(range: Range) {
        return new Position(range.startContainer, range.startOffset);
    }

    /**
     * Get end position of the given Range
     * @param range The range to get position from
     */
    static getEnd(range: Range) {
        // For collapsed range, always return the same value of start container to make sure
        // end position is not before start position
        return range.collapsed
            ? Position.getStart(range)
            : new Position(range.endContainer, range.endOffset, true /*isFromEndOfRange*/);
    }
}

function getIndexOfNode(node: Node | null): number {
    let i = 0;
    while ((node = node?.previousSibling || null)) {
        i++;
    }
    return i;
}

function getEndOffset(node: Node): number {
    if (node.nodeType == NodeType.Text) {
        return node.nodeValue?.length || 0;
    } else if (node.nodeType == NodeType.Element || node.nodeType == NodeType.DocumentFragment) {
        return node.childNodes.length;
    } else {
        return 1;
    }
}
