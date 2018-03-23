import { getFirstInlineElement } from '../inlineElements/getFirstLastInlineElement';
import { getFirstLeafNode } from '../domWalker/getLeafNode';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import InlineElement from '../inlineElements/InlineElement';
import BlockElement from '../blockElements/BlockElement';
import TraversingScoper from './TraversingScoper';
import contains from '../utils/contains';

// This provides scoper for traversing the entire editor body starting from the beginning
class BodyScoper implements TraversingScoper {
    constructor(private rootNode: Node) {}

    // Get the start block element
    public getStartBlockElement(): BlockElement {
        return getBlockElementAtNode(this.rootNode, getFirstLeafNode(this.rootNode));
    }

    // Get the first inline element in the editor
    public getStartInlineElement(): InlineElement {
        return getFirstInlineElement(this.rootNode);
    }

    // Since the scope is global, all blocks under the root node are in scope
    public isBlockInScope(blockElement: BlockElement): boolean {
        return contains(this.rootNode, blockElement.getStartNode());
    }

    // Since we're at body scope, inline elements never need to be trimmed
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return inlineElement;
    }
}

export default BodyScoper;
