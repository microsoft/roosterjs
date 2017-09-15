import InlineElementFactory from './InlineElementFactory';
import NodeInlineElement from './NodeInlineElement';
import { BlockElement } from 'roosterjs-editor-types';

// This is inline element presenting an html hyperlink
export default class LinkInlineElement extends NodeInlineElement {
    constructor(
        containerNode: Node,
        rootNode: Node,
        parentBlock: BlockElement,
        inlineElementFactory: InlineElementFactory
    ) {
        super(containerNode, rootNode, parentBlock, inlineElementFactory);
        //TODO: assert on the tag
    }
}
