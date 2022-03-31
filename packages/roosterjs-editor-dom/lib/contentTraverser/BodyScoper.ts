import contains from '../utils/contains';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getFirstLastBlockElement from '../blockElements/getFirstLastBlockElement';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import TraversingScoper from './TraversingScoper';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { getFirstInlineElement } from '../inlineElements/getFirstLastInlineElement';

/**
 * @internal
 * provides a scope object for traversing the entire editor body starting from the beginning
 */
export default class BodyScoper implements TraversingScoper {
    private startNode: Node | null;

    /**
     * Construct a new instance of BodyScoper class
     * @param rootNode Root node of the body
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    constructor(public rootNode: Node, startNode?: Node) {
        this.startNode = contains(rootNode, startNode) ? startNode! : null;
    }

    /**
     * Get the start block element
     */
    public getStartBlockElement(): BlockElement | null {
        return this.startNode
            ? getBlockElementAtNode(this.rootNode, this.startNode)
            : getFirstLastBlockElement(this.rootNode, true /*isFirst*/);
    }

    /**
     * Get the start inline element
     */
    public getStartInlineElement(): InlineElement | null {
        return this.startNode
            ? getInlineElementAtNode(this.rootNode, this.startNode)
            : getFirstInlineElement(this.rootNode);
    }

    /**
     * Since the scope is global, all blocks under the root node are in scope
     */
    public isBlockInScope(blockElement: BlockElement): boolean {
        return contains(this.rootNode, blockElement.getStartNode());
    }

    /**
     * Since we're at body scope, inline elements never need to be trimmed
     */
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return inlineElement;
    }
}
