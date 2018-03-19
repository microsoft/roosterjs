import { ContentPosition } from 'roosterjs-editor-types';
import InlineElement from '../inlineElements/InlineElement';
import BlockElement from '../blockElements/BlockElement';
import TraversingScoper from './TraversingScoper';
import Position from '../selection/Position';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import { getInlineElementAfter, getInlineElementBefore } from '../inlineElements/getInlineElementBeforeAfter';

/**
 * This provides traversing content in a selection start block
 * This is commonly used for those cursor context sensitive plugin,
 * they want to know text being typed at cursor
 * This provides a scope for parsing from cursor position up to begin of the selection block
 */
class BlockScoper implements TraversingScoper {
    private block: BlockElement;

    constructor(
        private rootNode: Node,
        private position: Position,
        private startPosition: ContentPosition
    ) {
        this.position = this.position.normalize();
        this.block = getBlockElementAtNode(rootNode, this.position.node);
    }

    /**
     * Get the start block element
     */
    public getStartBlockElement(): BlockElement {
        return this.block;
    }

    /**
     * Get the start inline element
     * The start inline refers to inline before the selection start
     *  The reason why we choose the one before rather after is, when cursor is at the end of a paragragh,
     * the one after likely will point to inline in next paragragh which may be null if the cursor is at bottom of editor
     */
    public getStartInlineElement(): InlineElement {
        let startInline: InlineElement;
        if (this.block) {
            switch (this.startPosition) {
                case ContentPosition.Begin:
                    startInline = this.block.getFirstInlineElement();
                    break;
                case ContentPosition.End:
                    startInline = this.block.getLastInlineElement();
                    break;
                case ContentPosition.SelectionStart:
                    // Get the inline before selection start point, and ensure it falls in the selection block
                    startInline = getInlineElementAfter(this.rootNode, this.position);
                    if (startInline && !this.block.contains(startInline)) {
                        startInline = null;
                    }
                    break;
            }
        }

        return startInline;
    }

    /**
     * This is special case to support when startInlineElement is null
     * startInlineElement being null can happen when cursor is in the end of block. In that case, there
     * isn't anything after the cursor so you get a null startInlineElement. The scoper works together
     * with content traverser. When users ask for a previous inline element and content traverser sees
     * a null startInline element, it will fall back to call this getInlineElementBeforeStart to get a
     * a previous inline element
     */
    public getInlineElementBeforeStart(): InlineElement {
        let inlineBeforeStart: InlineElement;
        if (this.block && this.startPosition == ContentPosition.SelectionStart) {
            // Get the inline before selection start point, and ensure it falls in the selection block
            inlineBeforeStart =  getInlineElementBefore(this.rootNode, this.position);
            if (inlineBeforeStart && !this.block.contains(inlineBeforeStart)) {
                inlineBeforeStart = null;
            }
        }

        return inlineBeforeStart;
    }

    /**
     * Check if the given block element is in current scope
     * @param blockElement The block element to check
     */
    public isBlockInScope(blockElement: BlockElement): boolean {
        return this.block && blockElement ? this.block.equals(blockElement) : false;
    }

    /**
     * Trim the incoming inline element, and return an inline element
     * This just tests and return the inline element if it is in block
     * This is a block scoper, which is not like selection scoper where it may cut an inline element in half
     * A block scoper does not cut an inline in half
     */
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return this.block && inlineElement && this.block.contains(inlineElement) ? inlineElement : null;
    }
}

export default BlockScoper;
