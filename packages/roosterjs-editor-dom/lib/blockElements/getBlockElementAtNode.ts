import collapseNodes from '../utils/collapseNodes';
import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isBlockElement from '../utils/isBlockElement';
import NodeBlockElement from './NodeBlockElement';
import StartEndBlockElement from './StartEndBlockElement';
import { BlockElement } from 'roosterjs-editor-types';

/**
 * This produces a block element from a a node
 * It needs to account for various HTML structure. Examples:
 * 1) &lt;root&gt;&lt;div&gt;abc&lt;/div&gt;&lt;/root&gt;
 *   This is most common the case, user passes in a node pointing to abc, and get back a block representing &lt;div&gt;abc&lt;/div&gt;
 * 2) &lt;root&gt;&lt;p&gt;&lt;br&gt;&lt;/p&gt;&lt;/root&gt;
 *   Common content for empty block, user passes node pointing to &lt;br&gt;, and get back a block representing &lt;p&gt;&lt;br&gt;&lt;/p&gt;
 * 3) &lt;root&gt;abc&lt;/root&gt;
 *   Not common, but does happen. It is still a block in user's view. User passes in abc, and get back a start-end block representing abc
 *   NOTE: abc could be just one node. However, since it is not a html block, it is more appropriate to use start-end block although they point to same node
 * 4) &lt;root&gt;&lt;div&gt;abc&lt;br&gt;123&lt;/div&gt;&lt;/root&gt;
 *   A bit tricky, but can happen when user use Ctrl+Enter which simply inserts a &lt;BR&gt; to create a link break. There're two blocks:
 *   block1: 1) abc&lt;br&gt; block2: 123
 * 5) &lt;root&gt;&lt;div&gt;abc&lt;div&gt;123&lt;/div&gt;&lt;/div&gt;&lt;/root&gt;
 *   Nesting div and there is text node in same level as a DIV. Two blocks: 1) abc 2) &lt;div&gt;123&lt;/div&gt;
 * 6) &lt;root&gt;&lt;div&gt;abc&lt;span&gt;123&lt;br&gt;456&lt;/span&gt;&lt;/div&gt;&lt;/root&gt;
 *   This is really tricky. Essentially there is a &lt;BR&gt; in middle of a span breaking the span into two blocks;
 *   block1: abc&lt;span&gt;123&lt;br&gt; block2: 456
 * In summary, given any arbitrary node (leaf), to identify the head and tail of the block, following rules need to be followed:
 * 1) to identify the head, it needs to crawl DOM tre left/up till a block node or BR is encountered
 * 2) same for identifying tail
 * 3) should also apply a block ceiling, meaning as it crawls up, it should stop at a block node
 * @param rootNode Root node of the scope, the block element will be inside of this node
 * @param node The node to get BlockElement start from
 */
export default function getBlockElementAtNode(
    rootNode: Node,
    node: Node | null
): BlockElement | null {
    if (!contains(rootNode, node)) {
        return null;
    }

    // Identify the containing block. This serves as ceiling for traversing down below
    // NOTE: this container block could be just the rootNode,
    // which cannot be used to create block element. We will special case handle it later on
    let containerBlockNode = StartEndBlockElement.getBlockContext(node!);
    if (!containerBlockNode) {
        return null;
    } else if (containerBlockNode == node) {
        return new NodeBlockElement(containerBlockNode);
    }

    // Find the head and leaf node in the block
    let headNode = findHeadTailLeafNode(node!, containerBlockNode, false /*isTail*/);
    let tailNode = findHeadTailLeafNode(node!, containerBlockNode, true /*isTail*/);

    if (!headNode || !tailNode) {
        return null;
    }

    // At this point, we have the head and tail of a block, here are some examples and where head and tail point to
    // 1) &lt;root&gt;&lt;div&gt;hello&lt;br&gt;&lt;/div&gt;&lt;/root&gt;, head: hello, tail: &lt;br&gt;
    // 2) &lt;root&gt;&lt;div&gt;hello&lt;span style="font-family: Arial"&gt;world&lt;/span&gt;&lt;/div&gt;&lt;/root&gt;, head: hello, tail: world
    // Both are actually completely and exclusively wrapped in a parent div, and can be represented with a Node block
    // So we shall try to collapse as much as we can to the nearest common ancestor
    let nodes = collapseNodes(rootNode, headNode, tailNode, false /*canSplitParent*/);

    if (nodes.length === 0) {
        return null;
    }

    headNode = nodes[0];
    tailNode = nodes[nodes.length - 1];

    if (headNode.parentNode != tailNode.parentNode) {
        // Un-Balanced start and end, create a start-end block
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
            } else if (parentNode && parentNode != rootNode) {
                // Continue collapsing to parent
                headNode = tailNode = parentNode;
            } else {
                break;
            }
        }

        // If head and tail are same and it is a block element, create NodeBlock, otherwise start-end block
        return headNode == tailNode && isBlockElement(headNode)
            ? new NodeBlockElement(headNode as HTMLElement)
            : new StartEndBlockElement(rootNode, headNode, tailNode);
    }
}

/**
 * Given a node and container block, identify the first/last leaf node
 * A leaf node is defined as deepest first/last node in a block
 * i.e. &lt;div&gt;&lt;span style="font-family: Arial"&gt;abc&lt;/span&gt;&lt;/div&gt;, abc is the head leaf of the block
 * Often &lt;br&gt; or a child &lt;div&gt; is used to create a block. In that case, the leaf after the sibling div or br should be the head leaf
 * i.e. &lt;div&gt;123&lt;br&gt;abc&lt;/div&gt;, abc is the head of a block because of a previous sibling &lt;br&gt;
 * i.e. &lt;div&gt;&lt;div&gt;123&lt;/div&gt;abc&lt;/div&gt;, abc is also the head of a block because of a previous sibling &lt;div&gt;
 */
function findHeadTailLeafNode(node: Node, containerBlockNode: Node, isTail: boolean): Node {
    let result = node;

    if (getTagOfNode(result) == 'BR' && isTail) {
        return result;
    }

    while (result) {
        let sibling: Node | null = node;
        while (node.parentNode && !(sibling = isTail ? node.nextSibling : node.previousSibling)) {
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
