import NodeInlineElement from './NodeInlineElement';
import { InlineElement, BlockElement } from './types';

// This factory holds all resolvers and provide function to resolve DOM node to inline element
class InlineElementFactory {
    // Resolve an inline element by a leaf node
    public resolve(node: Node, rootNode: Node, parentBlock: BlockElement): InlineElement {
        return new NodeInlineElement(node, parentBlock);
    }
}

export default InlineElementFactory;
