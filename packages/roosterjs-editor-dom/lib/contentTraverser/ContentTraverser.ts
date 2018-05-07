import InlineElement from '../inlineElements/InlineElement';
import BlockElement from '../blockElements/BlockElement';
import TraversingScoper from './TraversingScoper';
import SelectionRange from '../selection/SelectionRange';
import Position from '../selection/Position';
import { ContentPosition } from 'roosterjs-editor-types';
import BlockScoper from './BlockScoper';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import SelectionScoper from './SelectionScoper';
import BodyScoper from './BodyScoper';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import { getNextLeafSibling, getPreviousLeafSibling } from '../domWalker/getLeafSibling';

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
        let current = this.currentBlockElement;
        let next = current && this.getNextPreviousBlockElement(current, true /*isNext*/);

        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is after the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (next && this.scoper.isBlockInScope(next) && next.isAfter(current)) {
            this.currentBlock = next;
            return this.currentBlock;
        }

        return null;
    }

    /**
     * Get previous block element
     */
    public getPreviousBlockElement(): BlockElement {
        let current = this.currentBlockElement;
        let previous = current && this.getNextPreviousBlockElement(current, false /*isNext*/);

        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is before the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (previous && this.scoper.isBlockInScope(previous) && current.isAfter(previous)) {
            this.currentBlock = previous;
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
        if (!this.currentInlineElement) {
            return null;
        }

        let thisInline = this.currentInlineElement;
        let position = thisInline.getEndPosition();
        let candidate = position.isAtEnd
            ? getInlineElementAtNode(
                  getNextLeafSibling(this.rootNode, thisInline.getContainerNode())
              )
            : new PartialInlineElement(thisInline, position, null);
        let nextInline =
            candidate && (!thisInline || candidate.isAfter(thisInline))
                ? this.scoper.trimInlineElement(candidate)
                : null;
        this.currentInline = nextInline || this.currentInline;
        return nextInline;
    }

    /**
     * Get previous inline element
     */
    public getPreviousInlineElement(): InlineElement {
        if (!this.currentInlineElement) {
            return null;
        }

        let thisInline = this.currentInlineElement;
        let position = thisInline.getStartPosition();
        let candidate =
            position.offset == 0
                ? getInlineElementAtNode(
                      getPreviousLeafSibling(this.rootNode, thisInline.getContainerNode())
                  )
                : new PartialInlineElement(thisInline, null, position);
        let previousInline =
            candidate && (!thisInline || thisInline.isAfter(candidate))
                ? this.scoper.trimInlineElement(candidate)
                : null;

        this.currentInline = previousInline || this.currentInline;
        return previousInline;
    }

    private getNextPreviousBlockElement(current: BlockElement, isNext: boolean): BlockElement {
        if (!current) {
            return null;
        }

        // Get a leaf node after block's end element and use that base to find next block
        // TODO: this code is used to identify block, maybe we shouldn't exclude those empty nodes
        // We can improve this later on
        let leaf = getLeafSibling(
            this.rootNode,
            isNext ? current.getEndNode() : current.getStartNode(),
            isNext
        );
        return getBlockElementAtNode(this.rootNode, leaf);
    }
}

export default ContentTraverser;
