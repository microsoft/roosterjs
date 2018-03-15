import InlineElement from './InlineElement';
import NodeInlineElement from './NodeInlineElement';

/**
 * Get the inline element at a node
 * @param node The node to get InlineElement froms
 */
export default function getInlineElementAtNode(node: Node): InlineElement {
    return node ? new NodeInlineElement(node) : null;
}
