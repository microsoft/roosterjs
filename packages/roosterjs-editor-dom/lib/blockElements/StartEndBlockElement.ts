import BlockElement from './BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import intersectWithNodeRange from '../utils/intersectWithNodeRange';
import isNodeAfter from '../utils/isNodeAfter';

/**
 * This reprents a block that is identified by a start and end node
 * This is for cases like <ced>Hello<BR>World</ced>
 * in that case, Hello<BR> is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
export default class StartEndBlockElement implements BlockElement {
    protected firstInline: InlineElement;
    protected lastInline: InlineElement;

    /**
     * Create a new instance of StartEndBlockElement class
     * @param rootNode rootNode of current scope
     * @param startNode startNode of this block element
     * @param endNode end nod of this block element
     */
    constructor(protected startNode: Node, protected endNode: Node) {}

    /**
     * Gets the text content
     */
    public getTextContent(): string {
        let range = this.startNode.ownerDocument.createRange();
        range.setStartBefore(this.startNode);
        range.setEndAfter(this.endNode);
        return range.toString();
    }

    /**
     * Get all nodes represented in a Node array
     * This only works for balanced node -- start and end is at same level
     */
    public getContentNodes(): Node[] {
        let allNodes: Node[] = [];
        if (this.startNode.parentNode == this.endNode.parentNode) {
            for (let node = this.startNode; node && node != this.endNode; node = node.nextSibling) {
                allNodes.push(node);
            }
            allNodes.push(this.endNode);
        }

        return allNodes;
    }

    /**
     * Gets the start node
     */
    public getStartNode(): Node {
        return this.startNode;
    }

    /**
     * Gets the end node
     */
    public getEndNode(): Node {
        return this.endNode;
    }

    /**
     * Gets first inline
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            this.firstInline = getInlineElementAtNode(this.startNode);
        }

        return this.firstInline;
    }

    /**
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getInlineElementAtNode(this.endNode);
        }

        return this.lastInline;
    }

    /**
     * Checks equals of two blocks
     */
    public equals(blockElement: BlockElement): boolean {
        return (
            this.startNode == blockElement.getStartNode() &&
            this.endNode == blockElement.getEndNode()
        );
    }

    /**
     * Checks if this block element is after another block element
     */
    public isAfter(blockElement: BlockElement): boolean {
        return isNodeAfter(this.getStartNode(), blockElement.getEndNode());
    }

    /**
     * Checks if an inline falls inside me
     */
    public contains(inlineElement: InlineElement): boolean;

    /**
     * Checks if an Html node is contained within the block
     */
    public contains(node: Node): boolean;

    public contains(arg: InlineElement | Node): boolean {
        let node = arg instanceof Node ? arg : arg.getContainerNode();
        return intersectWithNodeRange(node, this.startNode, this.endNode, true /*containOnly*/);
    }
}
