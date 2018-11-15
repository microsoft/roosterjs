import getTagOfNode from '../utils/getTagOfNode';
import ImageInlineElement from './ImageInlineElement';
import LinkInlineElement from './LinkInlineElement';
import NodeInlineElement from './NodeInlineElement';
import TextInlineElement from './TextInlineElement';
import { BlockElement, InlineElement, NodeType } from 'roosterjs-editor-types';

/**
 * Resolve an inline element by a leaf node
 * @param node The node to resolve from
 * @param rootNode Root node of current scope
 * @param parentBlock The parent block element
 */
export default function resolveInlineElement(
    node: Node,
    rootNode: Node,
    parentBlock: BlockElement
): InlineElement {
    let nodeChain = [node];
    for (
        let parent = node.parentNode;
        parent && parentBlock.contains(parent);
        parent = parent.parentNode
    ) {
        nodeChain.push(parent);
    }

    let inlineElement: InlineElement;

    for (let i = nodeChain.length - 1; i >= 0 && !inlineElement; i--) {
        let currentNode = nodeChain[i];
        let tag = getTagOfNode(currentNode);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement(currentNode, parentBlock);
        } else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement(currentNode, parentBlock);
        } else if (currentNode.nodeType == NodeType.Text) {
            inlineElement = new TextInlineElement(currentNode, parentBlock);
        }
    }

    return inlineElement || new NodeInlineElement(node, parentBlock);
}
