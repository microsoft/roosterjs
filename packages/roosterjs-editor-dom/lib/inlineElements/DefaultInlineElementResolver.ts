import ImageInlineElement from './ImageInlineElement';
import InlineElementFactory from './InlineElementFactory';
import InlineElementResolver from './InlineElementResolver';
import LinkInlineElement from './LinkInlineElement';
import TextInlineElement from './TextInlineElement';
import getTagOfNode from '../utils/getTagOfNode';
import { BlockElement, InlineElement, NodeType } from 'roosterjs-editor-types';

// This is default inline element resolver which produces very basic inline elements
class DefaultInlineElementResolver implements InlineElementResolver {
    public resolve(
        node: Node,
        rootNode: Node,
        parentBlock: BlockElement,
        inlineElementFactory: InlineElementFactory
    ): InlineElement {
        // Create LinkInlineElement or ImageInlineElement depending on the tag, and resort to TextInlineElement at last
        let inlineElement: InlineElement = null;
        let tag = getTagOfNode(node);
        if (tag == 'A') {
            inlineElement = new LinkInlineElement(node, parentBlock);
        } else if (tag == 'IMG') {
            inlineElement = new ImageInlineElement(node, parentBlock);
        } else if (node.nodeType == NodeType.Text) {
            inlineElement = new TextInlineElement(node, parentBlock);
        }

        return inlineElement;
    }
}

export default DefaultInlineElementResolver;
