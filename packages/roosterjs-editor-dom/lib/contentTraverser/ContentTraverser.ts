import InlineElementFactory from '../inlineElements/InlineElementFactory';
import { BlockElement, InlineElement, TraversingScoper } from 'roosterjs-editor-types';
import {
    getNextBlockElement,
    getPreviousBlockElement,
    getNextInlineElement,
    getPreviousInlineElement,
} from '../blockElements/BlockElement';

// The provides traversing of content inside editor.
// There are two ways to traverse, block by block, or inline element by inline element
// Block and inline traversing is independent from each other, meanning if you traverse block by block, it does not change
// the current inline element position
class ContentTraverser {
    private currentInline: InlineElement;
    private currentBlock: BlockElement;

    constructor(
        private rootNode: Node,
        private scoper: TraversingScoper,
        private inlineElementFactory: InlineElementFactory
    ) {}

    // Get current block
    public get currentBlockElement(): BlockElement {
        // Prepare currentBlock from the scoper
        if (!this.currentBlock) {
            this.currentBlock = this.scoper.getStartBlockElement();
        }

        return this.currentBlock;
    }

    // Get next block element
    public getNextBlockElement(): BlockElement {
        let thisBlock = this.currentBlockElement;
        let nextBlock = thisBlock
            ? getNextBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
            : null;

        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is after the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (nextBlock && this.scoper.isBlockInScope(nextBlock) && nextBlock.isAfter(thisBlock)) {
            this.currentBlock = nextBlock;
            return this.currentBlock;
        }

        return null;
    }

    // Get previous block element
    public getPreviousBlockElement(): BlockElement {
        let thisBlock = this.currentBlockElement;
        let previousBlock = thisBlock
            ? getPreviousBlockElement(this.rootNode, thisBlock, this.inlineElementFactory)
            : null;

        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is before the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (
            previousBlock &&
            this.scoper.isBlockInScope(previousBlock) &&
            thisBlock.isAfter(previousBlock)
        ) {
            this.currentBlock = previousBlock;
            return this.currentBlock;
        }

        return null;
    }

    // Current inline element getter
    public get currentInlineElement(): InlineElement {
        // Retrieve a start inline from scoper
        if (!this.currentInline) {
            this.currentInline = this.scoper.getStartInlineElement();
        }

        return this.currentInline;
    }

    // Get next inline element
    public getNextInlineElement(): InlineElement {
        let thisInline = this.currentInlineElement;
        let nextInline: InlineElement;
        if (thisInline) {
            nextInline = getNextInlineElement(this.rootNode, thisInline, this.inlineElementFactory);
        } else {
            nextInline = this.scoper.getInlineElementAfterStart
                ? this.scoper.getInlineElementAfterStart()
                : null;
        }

        // For inline, we need to make sure:
        // 1) it is really next to current, unless current is null
        // 2) pass on the new inline to this.scoper to do the triming and we still get back an inline
        // Then
        // 1) re-position current inline
        if (
            nextInline &&
            (!thisInline || nextInline.isAfter(thisInline)) &&
            (nextInline = this.scoper.trimInlineElement(nextInline))
        ) {
            this.currentInline = nextInline;
            return this.currentInline;
        }

        return null;
    }

    // Get previous inline element
    public getPreviousInlineElement(): InlineElement {
        let thisInline = this.currentInlineElement;
        let previousInline: InlineElement;
        if (thisInline) {
            previousInline = getPreviousInlineElement(
                this.rootNode,
                thisInline,
                this.inlineElementFactory
            );
        } else {
            previousInline = this.scoper.getInlineElementBeforeStart
                ? this.scoper.getInlineElementBeforeStart()
                : null;
        }

        // For inline, we need to make sure:
        // 1) it is really previous to current
        // 2) pass on the new inline to this.scoper to do the trimming and we still get back an inline
        // Then
        // 1) re-position current inline
        if (
            previousInline &&
            (!thisInline || thisInline.isAfter(previousInline)) &&
            (previousInline = this.scoper.trimInlineElement(previousInline))
        ) {
            this.currentInline = previousInline;
            return this.currentInline;
        }

        return null;
    }
}

export default ContentTraverser;
