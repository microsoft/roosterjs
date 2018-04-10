import InlineElement from './InlineElement';
import Position from '../selection/Position';
import PositionType from '../selection/PositionType';
import SelectionRange from '../selection/SelectionRange';
import getTagOfNode from '../utils/getTagOfNode';
import isNodeAfter from '../utils/isNodeAfter';
import { NodeType } from 'roosterjs-editor-types';

/**
 * This presents an inline element that can be reprented by a single html node.
 * This serves as base for most inline element as it contains most implentation
 * of all operations that can happen on an inline element. Other sub inline elements mostly
 * just identify themself for a certain type
 */
class NodeInlineElement implements InlineElement {
    constructor(private containerNode: Node) {}

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

    /**
     * Get the start point of the inline element
     */
    public getStartPosition(): Position {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        return new Position(this.containerNode, 0).normalize();
    }

    /**
     * Get the end point of the inline element
     */
    public getEndPosition(): Position {
        // For an editor point, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        return new Position(this.containerNode, PositionType.End).normalize();
    }

    /**
     * Get a value to indicate whether this element contains text only
     */
    public isText() {
        return this.containerNode.nodeType == NodeType.Text;
    }

    /**
     * Checks if an inline element is after the current inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        return isNodeAfter(this.containerNode, inlineElement.getContainerNode());
    }

    /**
     * Checks if an editor point is contained in the inline element
     */
    public contains(position: Position): boolean {
        let start = this.getStartPosition();
        let end = this.getEndPosition();
        return position.isAfter(start) && end.isAfter(position);
    }

    /**
     * Apply inline style to an inline element
     */
    public applyStyle(styler: (element: HTMLElement) => void) {
        let node = this.containerNode;
        if (node.nodeType == NodeType.Text) {
            applyStyleToTextNode(node as Text, 0, node.nodeValue.length, styler);
        } else if (node.nodeType == NodeType.Element) {
            styler(node as HTMLElement);
        }
    }
}

export default NodeInlineElement;

/**
 * Apply style to a text node with start and end offsets
 * @param node Text node
 * @param start Start offset
 * @param end end offset
 * @param styler Style function
 */
export function applyStyleToTextNode(
    textNode: Text,
    start: number,
    end: number,
    styler: (element: HTMLElement) => void
) {
    let parentNode = textNode.parentNode;

    // Ignore text node direct under TR/TABLE or empty range
    let parentTag = getTagOfNode(parentNode);
    if (parentTag == 'TR' || parentTag == 'TABLE' || end <= start) {
        return;
    }

    if (parentNode.textContent.length == end - start) {
        // If the element is in a span and this element is everything of the parent
        // apply the style on parent span
        styler(parentNode as HTMLElement);
    } else if (end > start) {
        // It is partial of a text node
        let newNode = textNode.ownerDocument.createElement('SPAN');
        newNode.textContent = textNode.nodeValue.substring(start, end);

        let range = new SelectionRange(
            new Position(textNode, start),
            new Position(textNode, end)
        ).getRange();
        range.deleteContents();
        range.insertNode(newNode);
        styler(newNode);
    }
}
