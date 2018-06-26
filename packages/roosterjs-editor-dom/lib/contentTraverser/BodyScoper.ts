import TraversingScoper from './TraversingScoper';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { getFirstBlockElement, getFirstInlineElement } from '../blockElements/BlockElement';

// This provides scoper for traversing the entire editor body starting from the beginning
class BodyScoper implements TraversingScoper {
    constructor(public rootNode: Node) {}

    // Get the start block element
    public getStartBlockElement(): BlockElement {
        return getFirstBlockElement(this.rootNode);
    }

    // Get the first inline element in the editor
    public getStartInlineElement(): InlineElement {
        return getFirstInlineElement(this.rootNode);
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
