import NodeInlineElement from '../inlineElements/NodeInlineElement';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import collapseNodes from '../utils/collapseNodes';
import contains from '../utils/contains';
import createRange from '../selection/createRange';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import isNodeAfter from '../utils/isNodeAfter';
import resolveInlineElement from '../inlineElements/resolveInlineElement';
import wrap from '../utils/wrap';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { getFirstLeafNode, getLastLeafNode } from '../domWalker/getLeafNode';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import { splitBalancedNodeRange } from '../utils/splitParentNode';

/**
 * Get the inline element at a node
 * @param rootNode The root node of current scope
 * @param node The node to get InlineElement from
 * @param forceAtNode Force to get a NodeInlineElement at the given node
 */
function getInlineElementAtNode(rootNode: Node, node: Node, forceAtNode?: boolean): InlineElement {
    // An inline element has to be in a block element, get the block first and then resolve through the factory
    let parentBlock = node ? getBlockElementAtNode(rootNode, node) : null;
    return (
        parentBlock &&
        (forceAtNode
            ? new NodeInlineElement(node, parentBlock)
            : resolveInlineElement(node, rootNode, parentBlock))
    );
}

// Get first inline element
function getFirstInlineElement(rootNode: Node): InlineElement {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getFirstLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}

// Get last inline element
function getLastInlineElement(rootNode: Node): InlineElement {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getLastLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}

function getNextPreviousInlineElement(
    rootNode: Node,
    current: InlineElement,
    isNext: boolean
): InlineElement {
    if (!current) {
        return null;
    }
    if (current instanceof PartialInlineElement) {
        // if current is partial, get the the othe half of the inline unless it is no more
        if (isNext && current.nextInlineElement) {
            return current.nextInlineElement;
        } else if (!isNext && current.previousInlineElement) {
            return current.previousInlineElement;
        }
    }

    // Get a leaf node after startNode and use that base to find next inline
    let startNode = current.getContainerNode();
    startNode = getLeafSibling(rootNode, startNode, isNext);
    return getInlineElementAtNode(rootNode, startNode);
}

/**
 * This presents a content block that can be reprented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
class NodeBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

    constructor(private containerNode: Node) {}

    /**
     * Get the text content in the block
     */
    public getTextContent(): string {
        return this.containerNode.textContent;
    }

    /**
     * Get the start node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getStartNode(): Node {
        return this.containerNode;
    }

    /**
     * Get the end node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getEndNode(): Node {
        return this.containerNode;
    }

    /**
     * Get all nodes represented in a Node array
     */
    public getContentNodes(): Node[] {
        return [this.containerNode];
    }

    /**
     * Get the first inline element in the block
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            this.firstInline = getFirstInlineElement(this.containerNode);
        }

        return this.firstInline;
    }

    /**
     * Get the last inline element in the block
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getLastInlineElement(this.containerNode);
        }

        return this.lastInline;
    }

    /**
     * Gets all inline in the block
     */
    public getInlineElements(): InlineElement[] {
        let allInlines: InlineElement[] = [];
        let startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getNextPreviousInlineElement(
                this.containerNode,
                startInline,
                true /*isNext*/
            );
        }

        return allInlines;
    }

    /**
     * Checks if it refers to same block
     */
    public equals(blockElement: BlockElement): boolean {
        // Ideally there is only one unique way to generate a block so we only need to compare the startNode
        return this.containerNode == blockElement.getStartNode();
    }

    /**
     * Checks if a block is after the current block
     */
    public isAfter(blockElement: BlockElement): boolean {
        // if the block's startNode is after current node endEnd, we say it is after
        return isNodeAfter(this.containerNode, blockElement.getEndNode());
    }

    /**
     * Checks if an inline element falls within the block
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }

    /**
     * Checks if a certain html node is within the block
     */
    public contains(node: Node): boolean {
        return contains(this.containerNode, node, true /*treatSameNodeAsContain*/);
    }
}

/**
 * This reprents a block that is identified by a start and end node
 * This is for cases like <ced>Hello<BR>World</ced>
 * in that case, Hello<BR> is a block, World is another block
 * Such block cannot be represented by a NodeBlockElement since they don't chained up
 * to a single parent node, instead they have a start and end
 * This start and end must be in same sibling level and have same parent in DOM tree
 */
class StartEndBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

    constructor(private rootNode: Node, private startNode: Node, private endNode: Node) {}

    /**
     * Gets the text content
     */
    public getTextContent(): string {
        let range = createRange(this.startNode, this.endNode);
        return range.toString();
    }

    /**
     * Get all nodes represented in a Node array
     * This only works for balanced node -- start and end is at same level
     */
    public getContentNodes(): Node[] {
        return collapseNodes(
            getBlockContext(this.startNode),
            this.startNode,
            this.endNode,
            true /*canSplitParent*/
        );
    }

    /**
     * Convert this block element to NodeBlockElement by splitting parent nodes
     */
    public toNodeBlockElement(): NodeBlockElement {
        let nodes = this.getContentNodes();
        let blockContext = getBlockContext(this.startNode);
        while (nodes[0] && nodes[0] != blockContext && nodes[0].parentNode != this.rootNode) {
            nodes = [splitBalancedNodeRange(nodes)];
        }
        return new NodeBlockElement(
            nodes.length == 1 && isBlockElement(nodes[0]) ? nodes[0] : wrap(nodes)
        );
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
            this.firstInline = getInlineElementAtNode(this.rootNode, this.startNode);
        }

        return this.firstInline;
    }

    /**
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getInlineElementAtNode(this.rootNode, this.endNode);
        }

        return this.lastInline;
    }

    /**
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
     * Checks if an inline falls inside me
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }

    /**
     * Checks if an Html node is contained within the block
     */
    public contains(node: Node): boolean {
        return (
            contains(this.startNode, node, true /*treatSameNodeAsContain*/) ||
            contains(this.endNode, node, true /*treatSameNodeAsContain*/) ||
            (isNodeAfter(node, this.startNode) || isNodeAfter(this.endNode, node))
        );
    }
}

// This produces a block element from a a node
// It needs to account for various HTML structure. Examples:
// 1) <ced><div>abc</div></ced>
//   This is most common the case, user passes in a node pointing to abc, and get back a block representing <div>abc</div>
// 2) <ced><p><br></p></ced>
//   Common content for empty block for email client like OWA, user passes node pointing to <br>, and get back a block representing <p><br></p>
// 3) <ced>abc</ced>
//   Not common, but does happen. It is still a block in user's view. User passes in abc, and get back a start-end block representing abc
//   NOTE: abc could be just one node. However, since it is not a html block, it is more appropriate to use start-end block although they point to same node
// 4) <ced><div>abc<br>123</div></ced>
//   A bit tricky, but can happen when user use Ctrl+Enter which simply inserts a <BR> to create a link break. There're two blocks:
//   block1: 1) abc<br> block2: 123
// 5) <ced><div>abc<div>123</div></div></ced>
//   Nesting div and there is text node in same level as a DIV. Two blocks: 1) abc 2) <div>123</div>
// 6) <ced<div>abc<span>123<br>456</span></div></ced>
//   This is really tricky. Essentially there is a <BR> in middle of a span breaking the span into two blocks;
//   block1: abc<span>123<br> block2: 456
// In summary, given any arbitary node (leaf), to identify the head and tail of the block, following rules need to be followed:
// 1) to identify the head, it needs to crawl DOM tre left/up till a block node or BR is encountered
// 2) same for identifying tail
// 3) should also apply a block ceiling, meaning as it crawls up, it should stop at a block node
function getBlockElementAtNode(rootNode: Node, node: Node): BlockElement {
    if (!contains(rootNode, node)) {
        return null;
    }

    // Identify the containing block. This serves as ceiling for traversing down below
    // NOTE: this container block could be just the rootNode,
    // which cannot be used to create block element. We will special case handle it later on
    let containerBlockNode = getBlockContext(node);
    if (containerBlockNode == node) {
        return new NodeBlockElement(node);
    }

    // Find the head and leaf node in the block
    let headNode = findHeadTailLeafNode(node, containerBlockNode, false /*isTail*/);
    let tailNode = findHeadTailLeafNode(node, containerBlockNode, true /*isTail*/);

    // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
    // 1) <ced><div>hello<br></div></ced>, head: hello, tail: <br>
    // 2) <ced><div>hello<span style="font-family: Arial">world</span></div></ced>, head: hello, tail: world
    // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
    // So we shall try to collapse as much as we can to the nearest common ancester
    let nodes = collapseNodes(rootNode, headNode, tailNode, false /*canSplitParent*/);
    headNode = nodes[0];
    tailNode = nodes[nodes.length - 1];

    if (headNode.parentNode != tailNode.parentNode) {
        // Un-balanced start and end, create a start-end block
        return new StartEndBlockElement(rootNode, headNode, tailNode);
    } else {
        // Balanced start and end (point to same parent), need to see if further collapsing can be done
        while (!headNode.previousSibling && !tailNode.nextSibling) {
            let parentNode = headNode.parentNode;
            if (parentNode == containerBlockNode) {
                // Has reached the container block
                if (containerBlockNode != rootNode) {
                    // If the container block is not the root, use the container block
                    headNode = tailNode = parentNode;
                }
                break;
            } else {
                // Continue collapsing to parent
                headNode = tailNode = parentNode;
            }
        }

        // If head and tail are same and it is a block element, create NodeBlock, otherwise start-end block
        return headNode == tailNode && isBlockElement(headNode)
            ? new NodeBlockElement(headNode)
            : new StartEndBlockElement(rootNode, headNode, tailNode);
    }
}

/**
 * Given a node and container block, identify the first/last leaf node
 * A leaf node is defined as deepest first/last node in a block
 * i.e. <div><span style="font-family: Arial">abc</span></div>, abc is the head leaf of the block
 * Often <br> or a child <div> is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
 * i.e. <div>123<br>abc</div>, abc is the head of a block because of a previous sibling <br>
 * i.e. <div><div>123</div>abc</div>, abc is also the head of a block because of a previous sibling <div>
 */
function findHeadTailLeafNode(node: Node, containerBlockNode: Node, isTail: boolean): Node {
    let result = node;
    while (result) {
        let sibling = node;
        while (!(sibling = isTail ? node.nextSibling : node.previousSibling)) {
            node = node.parentNode;
            if (node == containerBlockNode) {
                return result;
            }
        }

        while (sibling) {
            if (isBlockElement(sibling)) {
                return result;
            } else if (getTagOfNode(sibling) == 'BR') {
                return isTail ? sibling : result;
            }

            node = sibling;
            sibling = isTail ? node.firstChild : node.lastChild;
        }

        result = node;
    }
    return result;
}

function getBlockContext(node: Node): Node {
    while (node && !isBlockElement(node)) {
        node = node.parentNode;
    }
    return node;
}

export {
    NodeBlockElement,
    StartEndBlockElement,
    getBlockElementAtNode,
    getFirstInlineElement,
    getLastInlineElement,
    getInlineElementAtNode,
    getNextPreviousInlineElement,
};
