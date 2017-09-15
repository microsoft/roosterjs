import InlineElementFactory from './InlineElementFactory';
import NodeInlineElement from './NodeInlineElement';
import { BlockElement } from 'roosterjs-editor-types';

// This is an inline element representing an Html image
export default class ImageInlineElement extends NodeInlineElement {
    constructor(
        containerNode: Node,
        rootNode: Node,
        parentBlock: BlockElement,
        inlineElementFactory: InlineElementFactory
    ) {
        super(containerNode, rootNode, parentBlock, inlineElementFactory);
        // TODO: assert on the html tag
    }
}
