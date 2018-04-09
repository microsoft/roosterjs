import InlineElement from '../inlineElements/InlineElement';
import BlockElement from '../blockElements/BlockElement';
import TraversingScoper from './TraversingScoper';
import {
    getNextInlineElement,
    getPreviousInlineElement,
} from '../inlineElements/getNextPreviousInlineElement';
import {
    getNextBlockElement,
    getPreviousBlockElement,
} from '../blockElements/getNextPreviousBlockElement';
import SelectionRange from '../selection/SelectionRange';
import Position from '../selection/Position';
import { ContentPosition } from 'roosterjs-editor-types';
import BlockScoper from './BlockScoper';
import SelectionScoper from './SelectionScoper';
import BodyScoper from './BodyScoper';

/**
 * The provides traversing of content inside editor.
 * There are two ways to traverse, block by block, or inline element by inline element
 * Block and inline traversing is independent from each other, meanning if you traverse block by block, it does not change
 * the current inline element position
 */
class ContentTraverser {
    private currentInline: InlineElement;
    private currentBlock: BlockElement;
    private scoper: TraversingScoper;

    /**
     * Create a content traverser for the whole body of given root node
     * @param rootNode The root node to traverse in
     */
    constructor(rootNode: Node);

    /**
     * Create a content traverser for the given selection
     * @param rootNode The root node to traverse in
     * @param range The selection range to scope the traversing
     */
    constructor(rootNode: Node, range: SelectionRange);

    /**
     * Create a content traverser for a block element which contains the given position
     * @param rootNode The root node to traverse in
     * @param positionInBlock A position inside a block, traversing will be scoped within this block
     * @param startFrom Start position of traversing. The value can be Begin, End, SelectionStart
     */
    constructor(rootNode: Node, positionInBlock: Position, startFrom: ContentPosition);

    constructor(
        private rootNode: Node,
        rangeOrPos?: SelectionRange | Position,
        startFrom?: ContentPosition
    ) {
        if (typeof startFrom != 'undefined') {
            this.scoper = new BlockScoper(rootNode, <Position>rangeOrPos, startFrom);
        } else if (rangeOrPos) {
            this.scoper = new SelectionScoper(rootNode, <SelectionRange>rangeOrPos);
        } else {
            this.scoper = new BodyScoper(rootNode);
        }
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
        let nextBlock = thisBlock ? getNextBlockElement(this.rootNode, thisBlock) : null;

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
        let previousBlock = thisBlock ? getPreviousBlockElement(this.rootNode, thisBlock) : null;

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
        let nextInline = this.getValidInlineElement(true /*isNext*/);
        this.currentInline = nextInline || this.currentInline;
        return nextInline;
    }

    /**
     * Get previous inline element
     */
    public getPreviousInlineElement(): InlineElement {
        let previousInline = this.getValidInlineElement(false /*isNext*/);
        this.currentInline = previousInline || this.currentInline;
        return previousInline;
    }

    private getValidInlineElement(isNext: boolean) {
        let thisInline = this.currentInlineElement;
        let getPreviousNextFunc = isNext ? getNextInlineElement : getPreviousInlineElement;
        let getBeforeAfterStartFunc = () =>
            isNext
                ? this.scoper.getInlineElementAfterStart()
                : this.scoper.getInlineElementBeforeStart();
        let candidate = thisInline
            ? getPreviousNextFunc(this.rootNode, thisInline)
            : getBeforeAfterStartFunc ? getBeforeAfterStartFunc() : null;

        // For inline, we need to make sure it is really next/previous to current, unless current is null.
        // Then trim it if necessary
        return candidate && (!thisInline || candidate.isAfter(thisInline) == isNext)
            ? this.scoper.trimInlineElement(candidate)
            : null;
    }
}

export default ContentTraverser;
