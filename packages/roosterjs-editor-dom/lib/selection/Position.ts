import { NodeType, Rect } from 'roosterjs-editor-types';
import Browser from '../utils/Browser';
import PositionType from './PositionType';
import getElementOrParentElement from '../utils/getElementOrParentElement';
import isNodeAfter from '../utils/isNodeAfter';

/**
 * Represent a position in DOM tree by the node and its offset index
 */
export default class Position {
    static readonly Before = PositionType.Before;
    static readonly Begin = PositionType.Begin;
    static readonly End = PositionType.End;
    static readonly After = PositionType.After;

    readonly node: Node;
    readonly element: HTMLElement;
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

        this.element = getElementOrParentElement(this.node);
    }

    /**
     * Normalize this position the leaf node, return the normalize result.
     * If current position is already using leaf node, return this position object itself
     */
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

    /**
     * Check if this position is equal to the given position
     * @param p The position to check
     */
    equalTo(p: Position): boolean {
        return (
            this == p ||
            (this.node == p.node && this.offset == p.offset && this.isAtEnd == p.isAtEnd)
        );
    }

    /**
     * Checks if position 1 is after position 2
     */
    isAfter(p: Position): boolean {
        return this.node == p.node
            ? (this.isAtEnd && !p.isAtEnd) || this.offset > p.offset
            : isNodeAfter(this.node, p.node);
    }

    /**
     * Get bounding rect of this position
     */
    getRect(): Rect {
        let document = this.node && this.node.ownerDocument;

        if (!document) {
            return null;
        }

        let range = document.createRange();
        range.setStart(this.node, this.offset);

        // 1) try to get rect using range.getBoundingClientRect()
        let rect = normalizeRect(range.getBoundingClientRect());

        if (!rect) {
            let { node, element, offset } = this.normalize();

            // 2) if current cursor is inside text node, use range.getClientRects() for safari
            // or insert a SPAN and get the rect of SPAN for others
            if (Browser.isSafari) {
                let rects = range.getClientRects();
                if (rects && rects.length == 1) {
                    rect = normalizeRect(rects[0]);
                }
            } else {
                if (node.nodeType == NodeType.Text) {
                    let span = document.createElement('SPAN');
                    range.setStart(node, offset);
                    range.collapse(true /*toStart*/);
                    range.insertNode(span);
                    rect = normalizeRect(span.getBoundingClientRect());
                    span.parentNode.removeChild(span);
                }
            }

            // 4) fallback to element.getBoundingClientRect()
            if (!rect && element) {
                rect = normalizeRect(element.getBoundingClientRect());
            }
        }

        return rect;
    }

    /**
     * Move this position with offset, returns a new position with a valid offset in the same node
     * @param offset Offset to move with
     */
    move(offset: number) {
        return new Position(this.node, this.offset + offset);
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

function normalizeRect(clientRect: ClientRect): Rect {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    let { left, right, top, bottom } = clientRect || <ClientRect>{};
    return left + right + top + bottom > 0
        ? {
              left: Math.round(left),
              right: Math.round(right),
              top: Math.round(top),
              bottom: Math.round(bottom),
          }
        : null;
}
