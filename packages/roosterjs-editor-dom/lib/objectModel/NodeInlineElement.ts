import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isDocumentPosition from '../utils/isDocumentPosition';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import { DocumentPosition, NodeType } from 'roosterjs-editor-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../domWalker/getLeafSibling';
import Position from '../selection/Position';
import SelectionRange from '../selection/SelectionRange';
import { InlineElement, BlockElement } from './types';

// This presents an inline element that can be reprented by a single html node.
// This serves as base for most inline element as it contains most implentation
// of all operations that can happen on an inline element. Other sub inline elements mostly
// just identify themself for a certain type
class NodeInlineElement implements InlineElement {
    constructor(private containerNode: Node, private parentBlock: BlockElement) {}

    // The text content for this inline element
    public getTextContent(): string {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return this.containerNode.nodeType == NodeType.Text
            ? this.containerNode.nodeValue
            : this.containerNode.textContent;
    }

    // Get the container node
    public getContainerNode(): Node {
        return this.containerNode;
    }

    // Get the parent block
    public getParentBlock(): BlockElement {
        return this.parentBlock;
    }

    // Get the start point of the inline element
    public getStartPosition(): Position {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        return new Position(this.containerNode, 0).normalize();
    }

    // Get the end point of the inline element
    public getEndPosition(): Position {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        return new Position(this.containerNode, Position.End).normalize();
    }

    // Checks if an inline element is after the current inline element
    public isAfter(inlineElement: InlineElement): boolean {
        return isNodeAfter(this.containerNode, inlineElement.getContainerNode());
    }

    // Checks if an editor point is contained in the inline element
    public contains(position: Position): boolean {
        let start = this.getStartPosition();
        let end = this.getEndPosition();
        return position.isAfter(start) && end.isAfter(position);
    }

    // Apply inline style to a region of an inline element. The region is identified thorugh the from and to point
    // The fromPosition and toPosition are optional and when bing missed, it indicates the boundary of the element
    // The function finds the minimal DOM on top of which styles can be applied, or create DOM when needed, i.e.
    // when the style has to be applied to partial of a text node, in that case, it wraps that in a SPAN and returns the SPAN
    // The actuall styling is done by consumer through the styler callback
    public applyStyle(styler: (node: Node) => void, from?: Position, to?: Position): void {
        let ownerDoc = this.containerNode.ownerDocument;

        // Adjust the start point
        if (!from) {
            from = new Position(this.containerNode, 0);
        } else if (from.isAtEnd) {
            let nextNode = getNextLeafSibling(this.containerNode, from.node);
            from = nextNode ? new Position(nextNode, 0) : null;
        }

        // Adjust the end point
        if (!to) {
            to = new Position(this.containerNode, Position.End);
        } else if (to.offset == 0) {
            let prevNode = getPreviousLeafSibling(this.containerNode, to.node);
            to = prevNode ? new Position(prevNode, Position.End) : null;
        }

        if (!from || !to) {
            // we need a valid start and end node, if either one is null, we will just exit
            // this isn't an error, it just tells the fact we don't see a good node to apply a style
            return;
        }

        from = from.normalize();
        to = to.normalize();

        let fromNode = from.node;
        let toNode = to.node;
        let fromOffset = from.offset;
        while (contains(this.containerNode, fromNode, true /*treatSameNodeAsContain*/)) {
            // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
            let nextLeafNode = getNextLeafSibling(this.containerNode, fromNode);

            let withinRange =
                fromNode == toNode ||
                isDocumentPosition(
                    fromNode.compareDocumentPosition(toNode),
                    DocumentPosition.Following
                );
            if (!withinRange) {
                break;
            }

            // Apply the style
            // If a node has only white space and new line and is in table, we ignore it,
            // otherwise the table will be distorted
            if (fromNode.nodeType == NodeType.Text && getTagOfNode(fromNode.parentNode) != 'TR') {
                let adjustedEndOffset = fromNode == toNode ? to.offset : fromNode.nodeValue.length;
                if (adjustedEndOffset > fromOffset) {
                    let len = adjustedEndOffset - fromOffset;
                    let parentNode = fromNode.parentNode;
                    if (
                        getTagOfNode(parentNode) == 'SPAN' &&
                        parentNode.textContent.length == len
                    ) {
                        // If the element is in a span and this element is everything of the parent
                        // apply the style on parent span
                        styler(parentNode);
                    } else if (len == fromNode.nodeValue.length) {
                        // It is whole text node
                        styler(wrap(fromNode, '<span></span>'));
                    } else {
                        // It is partial of a text node
                        let newNode = ownerDoc.createElement('SPAN');
                        newNode.textContent = fromNode.nodeValue.substring(
                            fromOffset,
                            adjustedEndOffset
                        );

                        let selectionRange = new SelectionRange(
                            new Position(fromNode, fromOffset),
                            new Position(fromNode, adjustedEndOffset)
                        );
                        let range = selectionRange.getRange();
                        range.deleteContents();
                        range.insertNode(newNode);
                        styler(newNode);
                    }
                }
            }

            fromNode = nextLeafNode;
            fromOffset = 0;
        }
    }
}

export default NodeInlineElement;
