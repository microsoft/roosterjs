import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getTagOfNode from '../utils/getTagOfNode';
import ImageInlineElement from './ImageInlineElement';
import LinkInlineElement from './LinkInlineElement';
import NodeInlineElement from './NodeInlineElement';
import safeInstanceOf from '../utils/safeInstanceOf';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';

/**
 * Get the inline element at a node
 * @param rootNode The root node of current scope
 * @param node The node to get InlineElement from
 */
export default function getInlineElementAtNode(rootNode: Node, node: Node | null): InlineElement;

/**
 * Get the inline element at a node
 * @param parentBlock Parent BlockElement of this node
 * @param node The node to get InlineElement from
 */
export default function getInlineElementAtNode(
    parentBlock: BlockElement,
    node: Node | null
): InlineElement;

export default function getInlineElementAtNode(
    parent: Node | BlockElement,
    node: Node | null
): InlineElement | null {
    // An inline element has to be in a block element, get the block first and then resolve through the factory
    let parentBlock = safeInstanceOf(parent, 'Node') ? getBlockElementAtNode(parent, node) : parent;
    return node && parentBlock && resolveInlineElement(node, parentBlock);
}

/**
 * Resolve an inline element by a leaf node
 * @param node The node to resolve from
 * @param parentBlock The parent block element
 */
function resolveInlineElement(node: Node, parentBlock: BlockElement): InlineElement {
    let nodeChain = [node];
    for (
        let parent = node.parentNode;
        parent && parentBlock.contains(parent);
        parent = parent.parentNode
    ) {
        nodeChain.push(parent);
    }

    let inlineElement: InlineElement | undefined;

    for (let i = nodeChain.length - 1; i >= 0 && !inlineElement; i--) {
        let currentNode = nodeChain[i];
        let tag = getTagOfNode(currentNode);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement(currentNode, parentBlock);
        } else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement(currentNode, parentBlock);
        }
    }

    return inlineElement || new NodeInlineElement(node, parentBlock);
}
