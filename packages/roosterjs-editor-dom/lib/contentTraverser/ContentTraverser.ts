import BodyScoper from './BodyScoper';
import EmptyInlineElement from '../inlineElements/EmptyInlineElement';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import SelectionBlockScoper from './SelectionBlockScoper';
import SelectionScoper from './SelectionScoper';
import TraversingScoper from './TraversingScoper';
import { getInlineElementBeforeAfter } from '../inlineElements/getInlineElementBeforeAfter';
import { getLeafSibling } from '../utils/getLeafSibling';
import type { CompatibleContentPosition } from 'roosterjs-editor-types/lib/compatibleTypes';
import {
    BlockElement,
    ContentPosition,
    IContentTraverser,
    InlineElement,
    NodePosition,
} from 'roosterjs-editor-types';

/**
 * The provides traversing of content inside editor.
 * There are two ways to traverse, block by block, or inline element by inline element
 * Block and inline traversing is independent from each other, meaning if you traverse block by block, it does not change
 * the current inline element position
 */
export default class ContentTraverser implements IContentTraverser {
    private currentInline: InlineElement | null = null;
    private currentBlock: BlockElement | null = null;

    /**
     * Create a content traverser for the whole body of given root node
     * @param scoper Traversing scoper object to help scope the traversing
     * @param skipTags (Optional) tags that child elements will be skipped
     */
    private constructor(private scoper: TraversingScoper, private skipTags?: string[]) {}

    /**
     * Create a content traverser for the whole body of given root node
     * @param rootNode The root node to traverse in
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     * @param skipTags (Optional) tags that child elements will be skipped
     */
    public static createBodyTraverser(
        rootNode: Node,
        startNode?: Node,
        skipTags?: string[]
    ): IContentTraverser {
        return new ContentTraverser(new BodyScoper(rootNode, startNode));
    }

    /**
     * Create a content traverser for the given selection
     * @param rootNode The root node to traverse in
     * @param range The selection range to scope the traversing
     * @param skipTags (Optional) tags that child elements will be skipped
     */
    public static createSelectionTraverser(
        rootNode: Node,
        range: Range,
        skipTags?: string[]
    ): IContentTraverser {
        return new ContentTraverser(new SelectionScoper(rootNode, range), skipTags);
    }

    /**
     * Create a content traverser for a block element which contains the given position
     * @param rootNode The root node to traverse in
     * @param position A position inside a block, traversing will be scoped within this block.
     * If passing a range, the start position of this range will be used
     * @param startFrom Start position of traversing. The value can be Begin, End, SelectionStart
     * @param skipTags (Optional) tags that child elements will be skipped
     */
    public static createBlockTraverser(
        rootNode: Node,
        position: NodePosition | Range,
        start: ContentPosition | CompatibleContentPosition = ContentPosition.SelectionStart,
        skipTags?: string[]
    ): IContentTraverser {
        return new ContentTraverser(new SelectionBlockScoper(rootNode, position, start));
    }

    /**
     * Get current block
     */
    public get currentBlockElement(): BlockElement | null {
        // Prepare currentBlock from the scoper
        if (!this.currentBlock) {
            this.currentBlock = this.scoper.getStartBlockElement();
        }

        return this.currentBlock;
    }

    /**
     * Get next block element
     */
    public getNextBlockElement(): BlockElement | null {
        return this.getPreviousNextBlockElement(true /*isNext*/);
    }

    /**
     * Get previous block element
     */
    public getPreviousBlockElement(): BlockElement | null {
        return this.getPreviousNextBlockElement(false /*isNext*/);
    }

    private getPreviousNextBlockElement(isNext: boolean): BlockElement | null {
        let current = this.currentBlockElement;

        if (!current) {
            return null;
        }

        let leaf = getLeafSibling(
            this.scoper.rootNode,
            isNext ? current.getEndNode() : current.getStartNode(),
            isNext,
            this.skipTags
        );
        let newBlock = leaf ? getBlockElementAtNode(this.scoper.rootNode, leaf) : null;

        // Make sure this is right block:
        // 1) the block is in scope per scoper
        // 2) the block is after (for next) or before (for previous) the current block
        // Then:
        // 1) Re-position current block to newly found block
        if (
            newBlock &&
            this.scoper.isBlockInScope(newBlock) &&
            ((isNext && newBlock.isAfter(current)) || (!isNext && current.isAfter(newBlock)))
        ) {
            this.currentBlock = newBlock;
            return this.currentBlock;
        }

        return null;
    }

    /**
     * Current inline element getter
     */
    public get currentInlineElement(): InlineElement | null {
        // Retrieve a start inline from scoper
        if (!this.currentInline) {
            this.currentInline = this.scoper.getStartInlineElement();
        }

        return this.currentInline instanceof EmptyInlineElement ? null : this.currentInline;
    }

    /**
     * Get next inline element
     */
    public getNextInlineElement(): InlineElement | null {
        return this.getPreviousNextInlineElement(true /*isNext*/);
    }

    /**
     * Get previous inline element
     */
    public getPreviousInlineElement(): InlineElement | null {
        return this.getPreviousNextInlineElement(false /*isNext*/);
    }

    private getPreviousNextInlineElement(isNext: boolean): InlineElement | null {
        let current = this.currentInlineElement || this.currentInline;
        let newInline: InlineElement | null;

        if (!current) {
            return null;
        }

        if (current instanceof EmptyInlineElement) {
            newInline = getInlineElementBeforeAfter(
                this.scoper.rootNode,
                current.getStartPosition(),
                isNext
            );
            if (newInline && !current.getParentBlock().contains(newInline.getContainerNode())) {
                newInline = null;
            }
        } else {
            newInline = getNextPreviousInlineElement(this.scoper.rootNode, current, isNext);
            newInline =
                newInline &&
                current &&
                ((isNext && newInline.isAfter(current)) || (!isNext && current.isAfter(newInline)))
                    ? newInline
                    : null;
        }

        // For inline, we need to make sure:
        // 1) it is really next/previous to current
        // 2) pass on the new inline to this.scoper to do the trimming and we still get back an inline
        // Then
        // 1) re-position current inline
        if (newInline && (newInline = this.scoper.trimInlineElement(newInline))) {
            this.currentInline = newInline;
            return this.currentInline;
        }

        return null;
    }
}

function getNextPreviousInlineElement(
    rootNode: Node,
    current: InlineElement,
    isNext: boolean
): InlineElement | null {
    if (!current) {
        return null;
    }
    if (current instanceof PartialInlineElement) {
        // if current is partial, get the other half of the inline unless it is no more
        let result = isNext ? current.nextInlineElement : current.previousInlineElement;

        if (result) {
            return result;
        }
    }

    // Get a leaf node after startNode and use that base to find next inline
    let startNode: Node | null = current.getContainerNode();
    startNode = getLeafSibling(rootNode, startNode, isNext);
    return getInlineElementAtNode(rootNode, startNode);
}
