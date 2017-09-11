import InlineElementFactory from './InlineElementFactory';
import NodeInlineElement from './NodeInlineElement';
import { BlockElement } from 'roosterjs-types';

// This refers to an inline element that represents a text node
export default class TextInlineElement extends NodeInlineElement {
    constructor(
        containerNode: Node,
        rootNode: Node,
        parentBlock: BlockElement,
        inlineElementFactory: InlineElementFactory
    ) {
        super(containerNode, rootNode, parentBlock, inlineElementFactory);
        // TODO: assert on the type
    }
}
