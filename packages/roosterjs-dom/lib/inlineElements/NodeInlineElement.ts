import InlineElementFactory from './InlineElementFactory';
import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isDocumentPosition from '../utils/isDocumentPosition';
import isEditorPointAfter from '../utils/isEditorPointAfter';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import {
    BlockElement,
    DocumentPosition,
    EditorPoint,
    InlineElement,
    NodeBoundary,
    NodeType,
} from 'roosterjs-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../domWalker/getLeafSibling';

// This presents an inline element that can be reprented by a single html node.
// This serves as base for most inline element as it contains most implentation
// of all operations that can happen on an inline element. Other sub inline elements mostly
// just identify themself for a certain type
class NodeInlineElement implements InlineElement {
    constructor(
        private containerNode: Node,
        private rootNode: Node,
        private parentBlock: BlockElement,
        private inlineElementFactory: InlineElementFactory
    ) {}

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
    public getStartPoint(): EditorPoint {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        let firstChild = this.containerNode;
        while (firstChild.firstChild) {
            firstChild = firstChild.firstChild;
        }
        return { containerNode: firstChild, offset: NodeBoundary.Begin };
    }

    // Get the end point of the inline element
    public getEndPoint(): EditorPoint {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        let lastChild = this.containerNode;
        while (lastChild.lastChild) {
            lastChild = lastChild.lastChild;
        }
        return {
            containerNode: lastChild,
            offset:
                lastChild.nodeType == NodeType.Text ? lastChild.nodeValue.length : NodeBoundary.End,
        };
    }

    // Checks if an inline element is after the current inline element
    public isAfter(inlineElement: InlineElement): boolean {
        return isNodeAfter(this.containerNode, inlineElement.getContainerNode());
    }

    // Checks if an editor point is contained in the inline element
    public contains(editorPoint: EditorPoint): boolean {
        let startPoint = this.getStartPoint();
        let endPoint = this.getEndPoint();
        return (
            isEditorPointAfter(editorPoint, startPoint) && isEditorPointAfter(endPoint, editorPoint)
        );
    }

    // Apply inline style to a region of an inline element. The region is identified thorugh the from and to point
    // The fromPoint and toPoint are optional and when bing missed, it indicates the boundary of the element
    // The function finds the minimal DOM on top of which styles can be applied, or create DOM when needed, i.e.
    // when the style has to be applied to partial of a text node, in that case, it wraps that in a SPAN and returns the SPAN
    // The actuall styling is done by consumer through the styler callback
    public applyStyle(
        styler: (node: Node) => void,
        fromPoint?: EditorPoint,
        toPoint?: EditorPoint
    ): void {
        let ownerDoc = this.containerNode.ownerDocument;

        let startNode: Node = null;
        let endNode: Node = null;
        let startOffset = NodeBoundary.Begin;
        let endOffset = NodeBoundary.End;

        // Adjust the start point
        if (fromPoint) {
            startNode = fromPoint.containerNode;
            startOffset = fromPoint.offset;
            if (
                (startNode.nodeType == NodeType.Text &&
                    startOffset == startNode.nodeValue.length) ||
                (startNode.nodeType == NodeType.Element && startOffset == NodeBoundary.End)
            ) {
                // The point is at the end of container element
                startNode = getNextLeafSibling(this.containerNode, startNode);
                startOffset = NodeBoundary.Begin;
            }
        } else {
            startNode = this.containerNode;
            while (startNode.firstChild) {
                startNode = startNode.firstChild;
                startOffset = NodeBoundary.Begin;
            }
        }

        // Adjust the end point
        if (toPoint) {
            endNode = toPoint.containerNode;
            endOffset = toPoint.offset;

            if (endOffset == NodeBoundary.Begin) {
                // The point is at the begin of container element, use previous leaf
                // Set endOffset to end of node
                endNode = getPreviousLeafSibling(this.containerNode, endNode);
                endOffset =
                    endNode && endNode.nodeType == NodeType.Text
                        ? endNode.nodeValue.length
                        : NodeBoundary.End;
            }
        } else {
            endNode = this.containerNode;
            while (endNode.lastChild) {
                endNode = endNode.lastChild;
            }

            endOffset =
                endNode && endNode.nodeType == NodeType.Text
                    ? endNode.nodeValue.length
                    : NodeBoundary.End;
        }

        if (!startNode || !endNode) {
            // we need a valid start and end node, if either one is null, we will just exit
            // this isn't an error, it just tells the fact we don't see a good node to apply a style
            return;
        }

        while (startNode == this.containerNode || contains(this.containerNode, startNode)) {
            // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
            let nextLeafNode = getNextLeafSibling(this.containerNode, startNode);

            let withinRange =
                startNode == endNode ||
                isDocumentPosition(
                    startNode.compareDocumentPosition(endNode),
                    DocumentPosition.Following
                );
            if (!withinRange) {
                break;
            }

            // Apply the style
            if (startNode.nodeType == NodeType.Text && startNode.nodeValue) {
                let adjustedEndOffset =
                    startNode == endNode ? endOffset : startNode.nodeValue.length;
                if (adjustedEndOffset > startOffset) {
                    let len = adjustedEndOffset - startOffset;
                    let parentNode = startNode.parentNode;
                    if (
                        getTagOfNode(parentNode) == 'SPAN' &&
                        parentNode.textContent.length == len
                    ) {
                        // If the element is in a span and this element is everything of the parent
                        // apply the style on parent span
                        styler(parentNode);
                    } else if (len == startNode.nodeValue.length) {
                        // It is whole text node
                        styler(wrap(startNode, '<span></span>'));
                    } else {
                        // It is partial of a text node
                        let newNode = ownerDoc.createElement('SPAN');
                        newNode.textContent = startNode.nodeValue.substring(
                            startOffset,
                            adjustedEndOffset
                        );

                        let range = ownerDoc.createRange();
                        range.setStart(startNode, startOffset);
                        range.setEnd(startNode, adjustedEndOffset);
                        range.deleteContents();
                        range.insertNode(newNode);
                        styler(newNode);
                    }
                }
            }

            startNode = nextLeafNode;
            startOffset = NodeBoundary.Begin;
        }
    }
}

export default NodeInlineElement;
