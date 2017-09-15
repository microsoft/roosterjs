import InlineElementFactory from '../inlineElements/InlineElementFactory';
import { BlockElement, InlineElement, TraversingScoper } from 'roosterjs-editor-types';
import { getFirstBlockElement } from '../domWalker/getBlockElement';
import { getFirstInlineElement } from '../domWalker/getInlineElement';

// This provides scoper for traversing the entire editor body starting from the beginning
class BodyScoper implements TraversingScoper {
    constructor(private rootNode: Node, private inlineElementFactory: InlineElementFactory) {}

    // Get the start block element
    public getStartBlockElement(): BlockElement {
        return getFirstBlockElement(this.rootNode, this.inlineElementFactory);
    }

    // Get the first inline element in the editor
    public getStartInlineElement(): InlineElement {
        return getFirstInlineElement(this.rootNode, this.inlineElementFactory);
    }

    // Since the scope is global, all blocks under the root node are in scope
    public isBlockInScope(blockElement: BlockElement): boolean {
        return this.rootNode.contains(blockElement.getStartNode());
    }

    // Since we're at body scope, inline elements never need to be trimmed
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return inlineElement;
    }
}

export default BodyScoper;
