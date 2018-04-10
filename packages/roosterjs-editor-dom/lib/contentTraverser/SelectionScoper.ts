import BlockElement from '../blockElements/BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import SelectionRange from '../selection/SelectionRange';
import TraversingScoper from './TraversingScoper';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import { getInlineElementAfter } from '../inlineElements/getInlineElementBeforeAfter';

/**
 * This is selection scoper that provide a start inline as the start of the selection
 * and checks if a block falls in the selection (isBlockInScope)
 * last trimInlineElement to trim any inline element to return a partial that falls in the selection
 */
class SelectionScoper implements TraversingScoper {
    private startBlock: BlockElement;
    private startInline: InlineElement;
    private range: SelectionRange;

    /**
     * Create a new instance of SelectionScoper class
     * @param rootNode The root node of the content
     * @param range The selection range to scope to
     */
    constructor(private rootNode: Node, range: SelectionRange) {
        this.range = range.normalize();
    }

    /**
     * Provide a start block as the first block after the cursor
     */
    public getStartBlockElement(): BlockElement {
        if (!this.startBlock) {
            this.startBlock = getBlockElementAtNode(this.rootNode, this.range.start.node);
        }
        return this.startBlock;
    }

    /**
     * Provide a start inline as the first inline after the cursor
     */
    public getStartInlineElement(): InlineElement {
        if (!this.startInline) {
            this.startInline = this.trimInlineElement(
                getInlineElementAfter(this.rootNode, this.range.start)
            );
        }
        return this.startInline;
    }

    /**
     * Checks if a block completely falls in the selection
     */
    public isBlockInScope(blockElement: BlockElement): boolean {
        if (!blockElement) {
            return false;
        }

        let inScope = false;
        let selStartBlock = this.getStartBlockElement();
        if (this.range.collapsed) {
            inScope = selStartBlock && selStartBlock.equals(blockElement);
        } else {
            let selEndBlock = getBlockElementAtNode(this.rootNode, this.range.end.node);

            // There are three cases that are considered as "block in scope"
            // 1) The start of selection falls on the block
            // 2) The end of selection falls on the block
            // 3) the block falls in-between selection start and end
            inScope =
                selStartBlock &&
                selEndBlock &&
                (blockElement.equals(selStartBlock) ||
                    blockElement.equals(selEndBlock) ||
                    (blockElement.isAfter(selStartBlock) && selEndBlock.isAfter(blockElement)));
        }

        return inScope;
    }

    /**
     * Trim an incoming inline. If it falls completely outside selection, return null
     * otherwise return a partial that represents the portion that falls in the selection
     */
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        let start = inlineElement.getStartPosition();
        let end = inlineElement.getEndPosition();

        if (start.isAfter(this.range.end) || this.range.start.isAfter(end)) {
            return null;
        }

        if (this.range.start.isAfter(start)) {
            start = this.range.start;
        }

        if (end.isAfter(this.range.end)) {
            end = this.range.end;
        }

        return start.offset > 0 || !end.isAtEnd
            ? new PartialInlineElement(inlineElement, start, end)
            : inlineElement;
    }
}

export default SelectionScoper;
