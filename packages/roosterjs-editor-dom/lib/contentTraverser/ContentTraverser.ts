import BodyScoper from './BodyScoper';
import SelectionBlockScoper from './SelectionBlockScoper';
import SelectionScoper from './SelectionScoper';
import TraversingScoper from './TraversingScoper';
import { BlockElement, ContentPosition, InlineElement } from 'roosterjs-editor-types';
import {
    getNextBlockElement,
    getPreviousBlockElement,
    getNextInlineElement,
    getPreviousInlineElement,
} from '../blockElements/BlockElement';

/**
 * The provides traversing of content inside editor.
 * There are two ways to traverse, block by block, or inline element by inline element
 * Block and inline traversing is independent from each other, meanning if you traverse block by block, it does not change
 * the current inline element position
 */
class ContentTraverser {
    private currentInline: InlineElement;
    private currentBlock: BlockElement;

    /**
     * Create a content traverser for the whole body of given root node
     * @param scoper Traversing scoper object to help scope the traversing
     */
    constructor(private scoper: TraversingScoper) {}

    /**
     * Create a content traverser for the whole body of given root node
     * @param rootNode The root node to traverse in
     */
    public static createBodyTraverser(rootNode: Node): ContentTraverser {
        return new ContentTraverser(new BodyScoper(rootNode));
    }

    /**
     * Create a content traverser for the given selection
     * @param rootNode The root node to traverse in
     * @param range The selection range to scope the traversing
     */
    public static createSelectionTraverser(rootNode: Node, range: Range): ContentTraverser {
        return new ContentTraverser(new SelectionScoper(rootNode, range));
    }

    /**
     * Create a content traverser for a block element which contains the given position
     * @param rootNode The root node to traverse in
     * @param positionInBlock A position inside a block, traversing will be scoped within this block
     * @param startFrom Start position of traversing. The value can be Begin, End, SelectionStart
     */
    public static createSelectionBlockTraverser(
        rootNode: Node,
        range: Range,
        start: ContentPosition = ContentPosition.SelectionStart
    ): ContentTraverser {
        return new ContentTraverser(new SelectionBlockScoper(rootNode, range, start));
    }

    /**
     * Get current block
     */
    public get currentBlockElement(): BlockElement {
        // Prepare currentBlock from the scoper
        if (!this.currentBlock) {
            this.currentBlock = this.scoper.getStartBlockElement();
        }

        return this.currentBlock;
    }

    /**
     * Get next block element
     */
    public getNextBlockElement(): BlockElement {
        let thisBlock = this.currentBlockElement;
        let nextBlock = thisBlock ? getNextBlockElement(this.scoper.rootNode, thisBlock) : null;

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

    /**
     * Get previous block element
     */
    public getPreviousBlockElement(): BlockElement {
        let thisBlock = this.currentBlockElement;
        let previousBlock = thisBlock
            ? getPreviousBlockElement(this.scoper.rootNode, thisBlock)
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

    /**
     * Current inline element getter
     */
    public get currentInlineElement(): InlineElement {
        // Retrieve a start inline from scoper
        if (!this.currentInline) {
            this.currentInline = this.scoper.getStartInlineElement();
        }

        return this.currentInline;
    }

    /**
     * Get next inline element
     */
    public getNextInlineElement(): InlineElement {
        let thisInline = this.currentInlineElement;
        let nextInline: InlineElement;
        if (thisInline) {
            nextInline = getNextInlineElement(this.scoper.rootNode, thisInline);
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

    /**
     * Get previous inline element
     */
    public getPreviousInlineElement(): InlineElement {
        let thisInline = this.currentInlineElement;
        let previousInline: InlineElement;
        if (thisInline) {
            previousInline = getPreviousInlineElement(this.scoper.rootNode, thisInline);
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
