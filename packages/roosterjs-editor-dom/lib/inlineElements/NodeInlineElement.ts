import Position from '../selection/Position';
import getTagOfNode from '../utils/getTagOfNode';
import isEditorPointAfter from '../utils/isEditorPointAfter';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import {
    BlockElement,
    EditorPoint,
    InlineElement,
    NodeType,
    PositionType,
} from 'roosterjs-editor-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../domWalker/getLeafSibling';
import splitParentNode from '../utils/splitParentNode';

/**
 * This presents an inline element that can be reprented by a single html node.
 * This serves as base for most inline element as it contains most implentation
 * of all operations that can happen on an inline element. Other sub inline elements mostly
 * just identify themself for a certain type
 */
class NodeInlineElement implements InlineElement {
    constructor(private containerNode: Node, private parentBlock: BlockElement) {}

    /**
     * The text content for this inline element
     */
    public getTextContent(): string {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return this.containerNode.nodeType == NodeType.Text
            ? this.containerNode.nodeValue
            : this.containerNode.textContent;
    }

    /**
     * Get the container node
     */
    public getContainerNode(): Node {
        return this.containerNode;
    }

    // Get the parent block
    public getParentBlock(): BlockElement {
        return this.parentBlock;
    }

    /**
     * Get the start point of the inline element
     */
    public getStartPoint(): EditorPoint {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        let firstChild = this.containerNode;
        while (firstChild.firstChild) {
            firstChild = firstChild.firstChild;
        }

        return new Position(firstChild, 0).toEditorPoint();
    }

    /**
     * Get the end point of the inline element
     */
    public getEndPoint(): EditorPoint {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        let lastChild = this.containerNode;
        while (lastChild.lastChild) {
            lastChild = lastChild.lastChild;
        }
        return new Position(lastChild, PositionType.End).toEditorPoint();
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return false;
    }

    /**
     * Checks if an inline element is after the current inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        return inlineElement
            ? isNodeAfter(this.containerNode, inlineElement.getContainerNode())
            : false;
    }

    /**
     * Checks if an editor point is contained in the inline element
     */
    public contains(editorPoint: EditorPoint): boolean {
        let startPoint = this.getStartPoint();
        let endPoint = this.getEndPoint();
        return (
            isEditorPointAfter(editorPoint, startPoint) && isEditorPointAfter(endPoint, editorPoint)
        );
    }

    /**
     * Apply inline style to an inline element
     */
    public applyStyle(
        styler: (element: HTMLElement) => any,
        fromPoint?: EditorPoint,
        toPoint?: EditorPoint
    ): void {
        let from = fromPoint
            ? Position.FromEditorPoint(fromPoint)
            : new Position(this.containerNode, PositionType.Begin).normalize();
        let to = toPoint
            ? Position.FromEditorPoint(toPoint)
            : new Position(this.containerNode, PositionType.End).normalize();
        if (from.isAtEnd) {
            let nextNode = getNextLeafSibling(this.containerNode, from.node);
            from = nextNode ? new Position(nextNode, PositionType.Begin) : null;
        }
        if (to.offset == 0) {
            let previousNode = getPreviousLeafSibling(this.containerNode, to.node);
            to = previousNode ? new Position(previousNode, PositionType.End) : null;
        }

        let formatNodes: Node[] = [];

        while (from && to && to.isAfter(from)) {
            let formatNode = from.node;
            let parentTag = getTagOfNode(formatNode.parentNode);

            if (formatNode.nodeType != NodeType.Text || ['TR', 'TABLE'].indexOf(parentTag) >= 0) {
                continue;
            }

            // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
            let nextNode = getNextLeafSibling(this.containerNode, formatNode);

            if (formatNode == to.node && !to.isAtEnd) {
                formatNode = splitTextNode(formatNode, to.offset, true /*returnFirstPart*/);
            }

            if (from.offset > 0) {
                formatNode = splitTextNode(formatNode, from.offset, false /*returnFirstPart*/);
            }

            formatNodes.push(formatNode);
            from = nextNode && new Position(nextNode, PositionType.Begin);
        }

        if (formatNodes.length > 0) {
            if (formatNodes.every(node => node.parentNode == formatNodes[0].parentNode)) {
                let newNode = formatNodes.shift();
                formatNodes.forEach(node => {
                    newNode.nodeValue += node.nodeValue;
                    node.parentNode.removeChild(node);
                });
                formatNodes = [newNode];
            }

            formatNodes.forEach(node => {
                if (getTagOfNode(node.parentNode) == 'SPAN') {
                    splitParentNode(node, true /*splitBefore*/, true /*removeEmptyNewNode*/);
                    splitParentNode(node, false /*splitAfter*/, true /*removeEmptyNewNode*/);
                    styler(node.parentNode as HTMLElement);
                } else {
                    styler(wrap(node, 'span'));
                }
            });
        }
    }
}

export default NodeInlineElement;

function splitTextNode(textNode: Node, offset: number, returnFirstPart: boolean) {
    let firstPart = textNode.nodeValue.substr(0, offset);
    let secondPart = textNode.nodeValue.substr(offset);
    let newNode = textNode.ownerDocument.createTextNode(returnFirstPart ? firstPart : secondPart);
    textNode.nodeValue = returnFirstPart ? secondPart : firstPart;
    textNode.parentNode.insertBefore(newNode, returnFirstPart ? textNode : textNode.nextSibling);
    return newNode;
}
