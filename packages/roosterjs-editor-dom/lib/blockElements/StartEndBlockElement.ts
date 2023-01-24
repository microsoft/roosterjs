import collapseNodes from '../utils/collapseNodes';
import contains from '../utils/contains';
import createRange from '../selection/createRange';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import isNodeAfter from '../utils/isNodeAfter';
import wrap from '../utils/wrap';
import { BlockElement } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from '../utils/splitParentNode';

const STRUCTURE_NODE_TAGS = ['TD', 'TH', 'LI', 'BLOCKQUOTE'];

/**
 * @internal
 * This represents a block that is identified by a start and end node
 * This is for cases like &lt;root&gt;Hello&lt;BR&gt;World&lt;/root&gt;
 * in that case, Hello&lt;BR&gt; is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
export default class StartEndBlockElement implements BlockElement {
    constructor(private rootNode: Node, private startNode: Node, private endNode: Node) {}

    static getBlockContext(node: Node): HTMLElement | null {
        let currentNode: Node | null = node;
        while (currentNode && !isBlockElement(currentNode)) {
            currentNode = currentNode.parentNode;
        }
        return currentNode as HTMLElement;
    }

    /**
     * Collapse this element to a single DOM element.
     * If the content nodes are separated in different root nodes, wrap them to a single node
     * If the content nodes are included in root node with other nodes, split root node
     */
    public collapseToSingleElement(): HTMLElement {
        const nodeContext = StartEndBlockElement.getBlockContext(this.startNode);
        let nodes = nodeContext
            ? collapseNodes(nodeContext, this.startNode, this.endNode, true /*canSplitParent*/)
            : [];
        let blockContext = StartEndBlockElement.getBlockContext(this.startNode);
        while (
            nodes[0] &&
            nodes[0] != blockContext &&
            nodes[0].parentNode != this.rootNode &&
            STRUCTURE_NODE_TAGS.indexOf(getTagOfNode(nodes[0].parentNode)) < 0
        ) {
            const newNode = splitBalancedNodeRange(nodes);
            if (newNode) {
                nodes = [newNode];
            } else {
                break;
            }
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
     * Get the text content of this block element
     */
    public getTextContent(): string {
        const range = createRange(this.getStartNode(), this.getEndNode());
        return range ? range.toString() : '';
    }
}
