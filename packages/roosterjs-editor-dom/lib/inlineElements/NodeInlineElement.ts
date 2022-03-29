import applyTextStyle from './applyTextStyle';
import isNodeAfter from '../utils/isNodeAfter';
import Position from '../selection/Position';
import {
    BlockElement,
    InlineElement,
    NodePosition,
    NodeType,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * This presents an inline element that can be represented by a single html node.
 * This serves as base for most inline element as it contains most implementation
 * of all operations that can happen on an inline element. Other sub inline elements mostly
 * just identify themselves for a certain type
 */
export default class NodeInlineElement implements InlineElement {
    constructor(private containerNode: Node, private parentBlock: BlockElement) {}

    /**
     * The text content for this inline element
     */
    public getTextContent(): string {
        // nodeValue is better way to retrieve content for a text. Others, just use textContent
        return (
            (this.containerNode.nodeType == NodeType.Text
                ? this.containerNode.nodeValue
                : this.containerNode.textContent) || ''
        );
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
     * Get the start position of the inline element
     */
    public getStartPosition(): NodePosition {
        // For a position, we always want it to point to a leaf node
        // We should try to go get the lowest first child node from the container
        return new Position(this.containerNode, 0).normalize();
    }

    /**
     * Get the end position of the inline element
     */
    public getEndPosition(): NodePosition {
        // For a position, we always want it to point to a leaf node
        // We should try to go get the lowest last child node from the container
        return new Position(this.containerNode, PositionType.End).normalize();
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return this.containerNode && this.containerNode.nodeType == NodeType.Text;
    }

    /**
     * Checks if an inline element is after the current inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        return inlineElement && isNodeAfter(this.containerNode, inlineElement.getContainerNode());
    }

    /**
     * Checks if the given position is contained in the inline element
     */
    public contains(pos: NodePosition): boolean {
        let start = this.getStartPosition();
        let end = this.getEndPosition();
        return pos && pos.isAfter(start) && end.isAfter(pos);
    }

    /**
     * Apply inline style to an inline element
     */
    public applyStyle(styler: (element: HTMLElement, isInnerNode?: boolean) => any): void {
        applyTextStyle(this.containerNode, styler);
    }
}
