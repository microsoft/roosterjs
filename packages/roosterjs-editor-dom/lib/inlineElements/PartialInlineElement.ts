import InlineElement from './InlineElement';
import NodeInlineElement, { applyStyleToTextNode } from './NodeInlineElement';
import Position from '../selection/Position';
import SelectionRange from '../selection/SelectionRange';
import contains from '../utils/contains';
import isDocumentPosition from '../utils/isDocumentPosition';
import { DocumentPosition, NodeType } from 'roosterjs-editor-types';
import { getNextLeafSibling } from '../domWalker/getLeafSibling';

/**
 * This is a special version of inline element that identifies a section of an inline element
 * We often have the need to cut an inline element in half and perform some operation only on half of an inline element
 * i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
 * PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
 * It also offers some special methods that others don't have, i.e. nextInlineElement etc.
 */
class PartialInlineElement implements InlineElement {
    private decoratedInline: NodeInlineElement;
    private start: Position;
    private end: Position;

    constructor(decoratedInline: InlineElement, start?: Position, end?: Position) {
        this.decoratedInline =
            decoratedInline instanceof NodeInlineElement
                ? decoratedInline
                : (<PartialInlineElement>decoratedInline).getDecoratedInline();
        let node = this.decoratedInline.getContainerNode();
        this.start = (start || new Position(node, Position.Begin)).normalize();
        this.end = (end || new Position(node, Position.End)).normalize();
    }

    /**
     * Get the full inline element that this partial inline decorates
     */
    public getDecoratedInline(): NodeInlineElement {
        return this.decoratedInline;
    }

    /**
     * Gets the container node
     */
    public getContainerNode(): Node {
        return this.decoratedInline.getContainerNode();
    }

    /**
     * Gets the text content
     */
    public getTextContent(): string {
        return new SelectionRange(this.start, this.end).getRange().toString();
    }

    /**
     * Gets the start position
     */
    public getStartPosition(): Position {
        return this.start;
    }

    /**
     * Gets the end position
     */
    public getEndPosition(): Position {
        return this.end;
    }

    /**
     * Checks if it contains a position
     */
    public contains(p: Position): boolean {
        return p.isAfter(this.start) && this.end.isAfter(p);
    }

    /**
     * Check if this inline element is after the other inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        let end = inlineElement.getEndPosition();
        return this.start.equalTo(end) || this.start.isAfter(end);
    }

    /**
     * apply style
     */
    public applyStyle(styler: (element: HTMLElement) => void) {
        let containerNode = this.getContainerNode();
        let currentNode = this.start.node;
        let offset = this.start.offset;
        while (
            contains(containerNode, currentNode, true /*treatSameNodeAsContain*/) &&
            (currentNode == this.end.node ||
                isDocumentPosition(
                    currentNode.compareDocumentPosition(this.end.node),
                    DocumentPosition.Following
                ))
        ) {
            // The code below modifies DOM. Need to get the next sibling first otherwise
            // you won't be able to reliably get a good next sibling node
            let nextLeafNode = getNextLeafSibling(containerNode, currentNode);
            if (currentNode.nodeType == NodeType.Text) {
                applyStyleToTextNode(
                    currentNode as Text,
                    offset,
                    currentNode == this.end.node ? this.end.offset : currentNode.nodeValue.length,
                    styler
                );
            }

            currentNode = nextLeafNode;
            offset = 0;
        }
    }
}

export default PartialInlineElement;
