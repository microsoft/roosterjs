import collapseNodes from '../utils/collapseNodes';
import contains from '../utils/contains';
import createRange from '../selection/createRange';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import getNextPreviousInlineElement from '../inlineElements/getNextPreviousInlineElement';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from '../utils/splitParentNode';

const STRUCTURE_NODE_TAGS = ['TD', 'TH', 'LI', 'BLOCKQUOTE'];

/**
 * This reprents a block that is identified by a start and end node
 * This is for cases like <root>Hello<BR>World</root>
 * in that case, Hello<BR> is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
export default class StartEndBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

    constructor(private rootNode: Node, private startNode: Node, private endNode: Node) {}

    static getBlockContext(node: Node): HTMLElement {
        while (node && !isBlockElement(node)) {
            node = node.parentNode;
        }
        return node as HTMLElement;
    }

    /**
     * Collapse this element to a single DOM element.
     * If the content nodes are separated in different root nodes, wrap them to a single node
     * If the content nodes are included in root node with other nodes, split root node
     */
    public collapseToSingleElement(): HTMLElement {
        let nodes = collapseNodes(
            StartEndBlockElement.getBlockContext(this.startNode),
            this.startNode,
            this.endNode,
            true /*canSplitParent*/
        );
        let blockContext = StartEndBlockElement.getBlockContext(this.startNode);
        while (
            nodes[0] &&
            nodes[0] != blockContext &&
            nodes[0].parentNode != this.rootNode &&
            !isStructureNode(nodes[0].parentNode)
        ) {
            nodes = [splitBalancedNodeRange(nodes)];
        }
        return nodes.length == 1 && isBlockElement(nodes[0])
            ? (nodes[0] as HTMLElement)
            : wrap(nodes);
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
     * Checks equals of two blocks
     */
    public equals(blockElement: BlockElement): boolean {
        return (
            this.startNode == blockElement.getStartNode() &&
            this.endNode == blockElement.getEndNode()
        );
    }

    /**
     * Checks if another block is after this current
     */
    public isAfter(blockElement: BlockElement): boolean {
        return isNodeAfter(this.getStartNode(), blockElement.getEndNode());
    }

    /**
     * Checks if an Html node is contained within the block
     */
    public contains(node: Node): boolean {
        return (
            contains(this.startNode, node, true /*treatSameNodeAsContain*/) ||
            contains(this.endNode, node, true /*treatSameNodeAsContain*/) ||
            (isNodeAfter(node, this.startNode) && isNodeAfter(this.endNode, node))
        );
    }

    /**
     * @deprecated
     * Gets the text content
     */
    public getTextContent(): string {
        let range = createRange(this.startNode, this.endNode);
        return range.toString();
    }

    /**
     * @deprecated
     * Get all nodes represented in a Node array
     * This only works for balanced node -- start and end is at same level
     */
    public getContentNodes(): Node[] {
        return collapseNodes(
            StartEndBlockElement.getBlockContext(this.startNode),
            this.startNode,
            this.endNode,
            true /*canSplitParent*/
        );
    }

    /**
     * @deprecated
     * Gets first inline
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            this.firstInline = getInlineElementAtNode(this.rootNode, this.startNode);
        }

        return this.firstInline;
    }

    /**
     * @deprecated
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getInlineElementAtNode(this.rootNode, this.endNode);
        }

        return this.lastInline;
    }

    /**
     * @deprecated
     * Gets all inline in the block
     */
    public getInlineElements(): InlineElement[] {
        let allInlines: InlineElement[] = [];
        let startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getNextPreviousInlineElement(this.rootNode, startInline, true /*isNext*/);
        }

        return allInlines;
    }

    /**
     * @deprecated
     * Checks if an inline falls inside me
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }
}

function isStructureNode(node: Node) {
    return STRUCTURE_NODE_TAGS.indexOf(getTagOfNode(node)) >= 0;
}
