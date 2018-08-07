import { NodeType, PositionType, Rect, EditorPoint } from 'roosterjs-editor-types';
import Browser from '../utils/Browser';
import contains from '../utils/contains';
import getElementOrParentElement from '../utils/getElementOrParentElement';
import isNodeAfter from '../utils/isNodeAfter';
import isNodeEmpty from '../utils/isNodeEmpty';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';

/**
 * Represent a position in DOM tree by the node and its offset index
 */
export default class Position {
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
                this.isAtEnd = offsetOrPosType > 0 && offsetOrPosType >= endOffset;
                break;
        }

        this.element = getElementOrParentElement(this.node);
    }

    /**
     * Normalize this position to the leaf node, return the normalize result.
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
     * Convert to focusable position
     * If current node is a void element, we need to move up one level to put cursor outside void element
     */
    toFocusablePosition() {
        return this.node.nodeType == NodeType.Element && isVoidHtmlElement(<HTMLElement>this.node)
            ? new Position(this.node, this.isAtEnd ? PositionType.After : PositionType.Before)
            : this;
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

            // 3) fallback to element.getBoundingClientRect()
            if (!rect && element) {
                rect = normalizeRect(element.getBoundingClientRect());
            }
        }

        return rect;
    }

    /**
     * Check if this position is at beginning of the given node
     * @param targetNode The node to check
     * @returns True if position is at beginning of the node, otherwise false
     */
    isAtBeginningOf(targetNode: Node) {
        let node = this.node;
        if (this.offset == 0) {
            while (contains(targetNode, this.node) && areAllPrevousNodesEmpty(node)) {
                node = node.parentNode;
            }

            if (node == targetNode) {
                return true;
            }
        } else {
            // This is to handle the case when position is before the target node
            return node.nodeType == NodeType.Element && node.childNodes[this.offset] == targetNode;
        }
    }

    /**
     * Get a restorable offset value. This combines offset and isAtEnd together, and only used for restoring a positing
     * When current node doesn't have any child node and the position is after the node, return value will be 1 rather than 0
     */
    getRestorableOffset() {
        return this.offset == 0 && this.isAtEnd ? 1 : this.offset;
    }

    /**
     * Move this position with offset, returns a new position with a valid offset in the same node
     * @param offset Offset to move with
     */
    move(offset: number) {
        return new Position(this.node, this.offset + offset);
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
        return new Position(range.endContainer, range.endOffset);
    }

    /**
     * @deprecated Do not use
     */
    static FromEditorPoint(point: EditorPoint) {
        return new Position(point.containerNode, point.offset);
    }

    /**
     * @deprecated Do not use
     */
    toEditorPoint() {
        return {
            containerNode: this.node,
            offset: this.getRestorableOffset(),
        };
    }
}

function areAllPrevousNodesEmpty(node: Node): boolean {
    while (node.previousSibling) {
        node = node.previousSibling;
        if (!isNodeEmpty(node)) {
            return false;
        }
    }
    return true;
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
