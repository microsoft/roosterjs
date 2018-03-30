import BlockElement from './BlockElement';
import contains from '../utils/contains';
import isBlockElement from '../utils/isBlockElement';
import NodeBlockElement from './NodeBlockElement';
import StartEndBlockElement from './StartEndBlockElement';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import getTagOfNode from '../utils/getTagOfNode';

/**
 * This produces a block element from a a node
 * It needs to account for various HTML structure. Examples:
 * 1) <ced><div>abc</div></ced>
 *   This is most common the case, user passes in a node pointing to abc, and get back a block representing <div>abc</div>
 * 2) <ced><p><br></p></ced>
 *   Common content for empty block, user passes node pointing to <br>, and get back a block representing <p><br></p>
 * 3) <ced>abc</ced>
 *   Not common, but does happen. It is still a block in user's view. User passes in abc, and get back a start-end block representing abc
 *   NOTE: abc could be just one node. However, since it is not a html block, it is more appropriate to use start-end block although they point to same node
 * 4) <ced><div>abc<br>123</div></ced>
 *   A bit tricky, but can happen when user use Ctrl+Enter which simply inserts a <BR> to create a link break. There're two blocks:
 *   block1: 1) abc<br> block2: 123
 * 5) <ced><div>abc<div>123</div></div></ced>
 *   Nesting div and there is text node in same level as a DIV. Two blocks: 1) abc 2) <div>123</div>
 * 6) <ced><div>abc<span>123<br>456</span></div></ced>
 *   This is really tricky. Essentially there is a <BR> in middle of a span breaking the span into two blocks;
 *   block1: abc<span>123<br> block2: 456
 * In summary, given any arbitary node (leaf), to identify the head and tail of the block, following rules need to be followed:
 * 1) to identify the head, it needs to crawl DOM tre left/up till a block node or BR is encountered
 * 2) same for identifying tail
 * 3) should also apply a block ceiling, meaning as it crawls up, it should stop at a block node
 */
export default function getBlockElementAtNode(rootNode: Node, node: Node): BlockElement {
    if (!node || !contains(rootNode, node)) {
        return null;
    } else if (isBlockElement(node)) {
        return new NodeBlockElement(node);
    } else {
        // Identify the containing block. This serves as ceiling for traversing down below
        // NOTE: this container block could be just the rootNode,
        // which cannot be used to create block element. We will special case handle it later on
        let containerBlockNode = node.parentNode;
        while (contains(rootNode, containerBlockNode) && !isBlockElement(containerBlockNode)) {
            containerBlockNode = containerBlockNode.parentNode;
        }

        // Find the head and leaf node in the block
        let headNode = findHeadTailLeafNodeInBlock(node, containerBlockNode, false /*isTail*/);
        let tailNode = findHeadTailLeafNodeInBlock(node, containerBlockNode, true /*isTail*/);

        // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
        // 1) <ced><div>hello<br></div></ced>, head: hello, tail: <br>
        // 2) <ced><div>hello<span style="font-family: Arial">world</span></div></ced>, head: hello, tail: world
        // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
        // So we shall try to collapse as much as we can to the nearest common ancester
        headNode = getParentNearCommonAncestor(containerBlockNode, headNode, tailNode, true);
        tailNode = getParentNearCommonAncestor(containerBlockNode, tailNode, headNode, false);

        if (headNode.parentNode != tailNode.parentNode) {
            // Un-balanced start and end, create a start-end block
            return new StartEndBlockElement(headNode, tailNode);
        } else {
            // Balanced start and end (point to same parent), need to see if further collapsing can be done
            let parentNode = headNode.parentNode;
            while (parentNode.firstChild == headNode && parentNode.lastChild == tailNode) {
                if (parentNode != containerBlockNode) {
                    // Continue collapsing to parent
                    headNode = tailNode = parentNode;
                    parentNode = parentNode.parentNode;
                } else if (containerBlockNode != rootNode) {
                    // Has reached the container block
                    // If the container block is not the root, use the container block
                    headNode = tailNode = parentNode;
                    break;
                }
            }

            // If head and tail are same and it is a block element, create NodeBlock, otherwise start-end block
            return  headNode == tailNode && isBlockElement(headNode)
                    ? new NodeBlockElement(headNode)
                    : new StartEndBlockElement(headNode, tailNode);
        }
    }
}

/**
 * Given a node and container block, identify the first leaf (head) node
 * A leaf node is defined as deepest first node in a block
 * i.e. <div><span style="font-family: Arial">abc</span></div>, abc is the head leaf of the block
 * Often <br> or a child <div> is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
 * i.e. <div>123<br>abc</div>, abc is the head of a block because of a previous sibling <br>
 * i.e. <div><div>123</div>abc</div>, abc is also the head of a block because of a previous sibling <div>
 * To identify the head leaf of a block, we basically start from a node, go all the way towards left till a sibling <div> or <br>
 * in DOM tree traversal, it is three traversal:
 * 1) previous sibling traversal
 * 2) parent traversal looking for a previous sibling from parent
 * 3) last child traversal, repeat from 1-3
 */
function findHeadTailLeafNodeInBlock(node: Node, container: Node, isTail: boolean): Node {
    let sibling = node;
    let isBr = false;

    do {
        node = sibling;
        sibling = getLeafSibling(container, node, isTail, isBlockElement);
        isBr = getTagOfNode(sibling) == 'BR';
    } while (sibling && !isBlockElement(sibling) && !isBr);

    return isBr && isTail ? sibling : node;
}

function getParentNearCommonAncestor(
    containerBlockNode: Node,
    thisNode: Node,
    otherNode: Node,
    checkFirstNode: boolean
): Node {
    let parentNode = thisNode.parentNode;
    while (
        (checkFirstNode ? parentNode.firstChild : parentNode.lastChild) == thisNode &&
        parentNode != containerBlockNode &&
        !contains(parentNode, otherNode)
    ) {
        thisNode = parentNode;
        parentNode = parentNode.parentNode;
    }
    return thisNode;
}
