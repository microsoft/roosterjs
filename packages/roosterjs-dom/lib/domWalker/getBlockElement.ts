import InlineElementFactory from '../inlineElements/InlineElementFactory';
import NodeBlockElement from '../blockElements/NodeBlockElement';
import StartEndBlockElement from '../blockElements/StartEndBlockElement';
import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import { BlockElement } from 'roosterjs-types';
import { getLeafSibling } from './getLeafSibling';

// Checks if the node is a BR
function isBrElement(node: Node): boolean {
    return getTagOfNode(node) == 'BR';
}

// Given a node and container block, identify the first leaf (head) node
// A leaf node is defined as deepest first node in a block
// i.e. <div><span style="font-family: Arial">abc</span></div>, abc is the head leaf of the block
// Often <br> or a child <div> is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
// i.e. <div>123<br>abc</div>, abc is the head of a block because of a previous sibling <br>
// i.e. <div><div>123</div>abc</div>, abc is also the head of a block because of a previous sibling <div>
// To identify the head leaf of a block, we basically start from a node, go all the way towards left till a sibling <div> or <br>
// in DOM tree traversal, it is three traversal:
// 1) previous sibling traversal
// 2) parent traversal looking for a previous sibling from parent
// 3) last child traversal, repeat from 1-3
function findHeadLeafNodeInBlock(node: Node, containerBlockNode: Node): Node {
    let headNode = node;
    let blockOrBrEncountered = false;
    while (!blockOrBrEncountered) {
        // 1) previous sibling traversal
        while (headNode.previousSibling) {
            let previousSibling = headNode.previousSibling;
            if (isBlockElement(previousSibling) || isBrElement(previousSibling)) {
                blockOrBrEncountered = true;
                break;
            } else {
                // move to previous sibling
                headNode = previousSibling;
            }
        }

        // break if a block or BR is seen
        if (blockOrBrEncountered) {
            break;
        }

        // 2) parent traversal looking for a previous sibling from parent
        let parentPreviousSibiling: Node;
        let parentNode = headNode.parentNode;
        while (parentNode != containerBlockNode) {
            if (parentNode.previousSibling) {
                parentPreviousSibiling = parentNode.previousSibling;
                break;
            } else {
                parentNode = parentNode.parentNode;
            }
        }

        // 3) last child traversal
        while (parentPreviousSibiling && parentPreviousSibiling.lastChild) {
            parentPreviousSibiling = parentPreviousSibiling.lastChild;
        }

        // parentPreviousSibiling is the seed for traversal
        // Check if it is a block or <br>, if so, stop right away. Otherwise, repeat the traversal
        if (parentPreviousSibiling) {
            if (isBlockElement(parentPreviousSibiling) || isBrElement(parentPreviousSibiling)) {
                blockOrBrEncountered = true;
                break;
            } else {
                headNode = parentPreviousSibiling;
            }
        } else {
            break;
        }
    }

    return headNode;
}

// This is similar to findHeadLeafNodeInBlock, but the other direction to identify the last leaf (tail) node
// One difference from findHeadLeafNodeInBlock, when it sees a <br>, the <br> should be used as tail.
// In another word, we consider <br> to be part of a block as ending node
function findTailLeafNodeInBlock(node: Node, containerBlockNode: Node): Node {
    let tailNode = node;
    let blockOrBrEncountered = false;
    let isBr = false;
    while (!blockOrBrEncountered) {
        // 1) next sibling traversal
        while (tailNode.nextSibling) {
            let nextSibling = tailNode.nextSibling;
            if (isBlockElement(nextSibling) || (isBr = isBrElement(nextSibling))) {
                blockOrBrEncountered = true;
                // if br, consider it to be ending node for a block
                if (isBr) {
                    tailNode = nextSibling;
                }
                break;
            } else {
                // move to next sibling
                tailNode = nextSibling;
            }
        }

        if (blockOrBrEncountered) {
            break;
        }

        // 2) parent traversal looking for a next sibling from parent
        let parentNextSibiling: Node;
        let parentNode = tailNode.parentNode;
        while (parentNode != containerBlockNode) {
            if (parentNode.nextSibling) {
                parentNextSibiling = parentNode.nextSibling;
                break;
            } else {
                parentNode = parentNode.parentNode;
            }
        }

        // 3) first child traversal
        while (parentNextSibiling && parentNextSibiling.firstChild) {
            parentNextSibiling = parentNextSibiling.firstChild;
        }

        // parentPreviousSibiling is the seed for traversal
        // Check if it is a block or <br>, if so, stop right away. Otherwise, repeat the traversal
        if (parentNextSibiling) {
            if (isBlockElement(parentNextSibiling) || (isBr = isBrElement(parentNextSibiling))) {
                blockOrBrEncountered = true;
                if (isBr) {
                    tailNode = parentNextSibiling;
                }
                break;
            } else {
                tailNode = parentNextSibiling;
            }
        } else {
            break;
        }
    }

    return tailNode;
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
export function getBlockElementAtNode(
    rootNode: Node,
    node: Node,
    inlineElementFactory: InlineElementFactory
): BlockElement {
    // TODO: assert node to be a leaf node
    let blockElement: BlockElement;
    if (node && contains(rootNode, node)) {
        // if the node is already a block, return right away
        if (isBlockElement(node)) {
            return new NodeBlockElement(node, inlineElementFactory);
        }

        // Identify the containing block. This serves as ceiling for traversing down below
        // NOTE: this container block could be just the rootNode,
        // which cannot be used to create block element. We will special case handle it later on
        let containerBlockNode = node.parentNode;
        while (!isBlockElement(containerBlockNode)) {
            containerBlockNode = containerBlockNode.parentNode;
        }

        // Find the head and leaf node in the block
        let headNode = findHeadLeafNodeInBlock(node, containerBlockNode);
        let tailNode = findTailLeafNodeInBlock(node, containerBlockNode);

        // TODO: assert headNode and tailNode to be leaf, and are within containerBlockNode
        // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
        // 1) <ced><div>hello<br></div></ced>, head: hello, tail: <br>
        // 2) <ced><div>hello<span style="font-family: Arial">world</span></div></ced>, head: hello, tail: world
        // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
        // So we shall try to collapse as much as we can to the nearest common ancester
        let parentNode = headNode.parentNode;
        while (parentNode.firstChild == headNode && parentNode != containerBlockNode) {
            if (contains(parentNode, tailNode)) {
                // this is an indication that the nearest common ancester has been reached
                break;
            } else {
                headNode = parentNode;
                parentNode = parentNode.parentNode;
            }
        }

        // Do same for the tail
        parentNode = tailNode.parentNode;
        while (parentNode.lastChild == tailNode && parentNode != containerBlockNode) {
            if (contains(parentNode, headNode)) {
                // this is an indication that the nearest common ancester has been reached
                break;
            } else {
                tailNode = parentNode;
                parentNode = parentNode.parentNode;
            }
        }

        if (headNode.parentNode != tailNode.parentNode) {
            // Un-balanced start and end, create a start-end block
            blockElement = new StartEndBlockElement(
                rootNode,
                headNode,
                tailNode,
                inlineElementFactory
            );
        } else {
            // Balanced start and end (point to same parent), need to see if further collapsing can be done
            parentNode = headNode.parentNode;
            while (parentNode.firstChild == headNode && parentNode.lastChild == tailNode) {
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
                    parentNode = parentNode.parentNode;
                }
            }

            // If head and tail are same and it is a block element, create NodeBlock, otherwise start-end block
            blockElement =
                headNode == tailNode && isBlockElement(headNode)
                    ? new NodeBlockElement(headNode, inlineElementFactory)
                    : new StartEndBlockElement(rootNode, headNode, tailNode, inlineElementFactory);
        }
    }

    return blockElement;
}

function getFirstLastBlockElement(
    rootNode: Node,
    inlineElementFactory: InlineElementFactory,
    isFirst: boolean
): BlockElement {
    let getChild = isFirst ? (node: Node) => node.firstChild : (node: Node) => node.lastChild;
    let node = getChild(rootNode);
    while (node && getChild(node)) {
        node = getChild(node);
    }

    return node ? getBlockElementAtNode(rootNode, node, inlineElementFactory) : null;
}

// Get the first block element
// NOTE: this can return null for empty container
export function getFirstBlockElement(
    rootNode: Node,
    inlineElementFactory: InlineElementFactory
): BlockElement {
    return getFirstLastBlockElement(rootNode, inlineElementFactory, true /*isFirst*/);
}

// Get the last block element
// NOTE: this can return null for empty container
export function getLastBlockElement(
    rootNode: Node,
    inlineElementFactory: InlineElementFactory
): BlockElement {
    return getFirstLastBlockElement(rootNode, inlineElementFactory, false /*isFirst*/);
}

function getNextPreviousBlockElement(
    rootNode: Node,
    blockElement: BlockElement,
    inlineElementFactory: InlineElementFactory,
    isNext: boolean
): BlockElement {
    let getNode = isNext
        ? (element: BlockElement) => element.getEndNode()
        : (element: BlockElement) => element.getStartNode();
    let result: BlockElement;
    if (blockElement) {
        // Get a leaf node after block's end element and use that base to find next block
        // TODO: this code is used to identify block, maybe we shouldn't exclude those empty nodes
        // We can improve this later on
        let leaf = getLeafSibling(rootNode, getNode(blockElement), isNext);
        result = leaf ? getBlockElementAtNode(rootNode, leaf, inlineElementFactory) : null;
    }

    return result;
}

// Get next block
export function getNextBlockElement(
    rootNode: Node,
    blockElement: BlockElement,
    inlineElementFactory: InlineElementFactory
) {
    return getNextPreviousBlockElement(
        rootNode,
        blockElement,
        inlineElementFactory,
        true /*isNext*/
    );
}

// Get previous block
export function getPreviousBlockElement(
    rootNode: Node,
    blockElement: BlockElement,
    inlineElementFactory: InlineElementFactory
) {
    return getNextPreviousBlockElement(
        rootNode,
        blockElement,
        inlineElementFactory,
        false /*isNext*/
    );
}
