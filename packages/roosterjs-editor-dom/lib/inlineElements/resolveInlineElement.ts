import ImageInlineElement from './ImageInlineElement';
import LinkInlineElement from './LinkInlineElement';
import NodeInlineElement from './NodeInlineElement';
import TextInlineElement from './TextInlineElement';
import getTagOfNode from '../utils/getTagOfNode';
import { BlockElement, InlineElement, NodeType } from 'roosterjs-editor-types';

/**
 * Resolve an inline element by a leaf node
 * @param node The node to resolve from
 * @
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
        parent = parent.parentNode;
    }

    let inlineElement: InlineElement;

    for (let i = nodeChain.length - 1; i >= 0 && !inlineElement; i--) {
        let tag = getTagOfNode(nodeChain[i]);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement(node, parentBlock);
        } else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement(node, parentBlock);
        } else if (node.nodeType == NodeType.Text) {
            inlineElement = new TextInlineElement(node, parentBlock);
        }
    }

    return inlineElement || new NodeInlineElement(node, parentBlock);
}
