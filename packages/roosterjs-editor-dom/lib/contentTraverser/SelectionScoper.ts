import Position from '../selection/Position';
import TraversingScoper from './TraversingScoper';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { getBlockElementAtNode } from '../blockElements/BlockElement';
import { getInlineElementAfter } from '../inlineElements/getInlineElementBeforeAfter';
import PartialInlineElement from '../inlineElements/PartialInlineElement';

/**
 * This is selection scoper that provide a start inline as the start of the selection
 * and checks if a block falls in the selection (isBlockInScope)
 * last trimInlineElement to trim any inline element to return a partial that falls in the selection
 */
class SelectionScoper implements TraversingScoper {
    private start: Position;
    private end: Position;
    private startBlock: BlockElement;
    private startInline: InlineElement;

    /**
     * Create a new instance of SelectionScoper class
     * @param rootNode The root node of the content
     * @param range The selection range to scope to
     */
    constructor(public rootNode: Node, range: Range) {
        this.start = Position.getStart(range).normalize();
        this.end = Position.getEnd(range).normalize();
    }

    /**
     * Provide a start block as the first block after the cursor
     */
    public getStartBlockElement(): BlockElement {
        if (!this.startBlock) {
            this.startBlock = getBlockElementAtNode(this.rootNode, this.start.node);
        }

        return this.startBlock;
    }

    /**
     * Provide a start inline as the first inline after the cursor
     */
    public getStartInlineElement(): InlineElement {
        if (!this.startInline) {
            this.startInline = this.trimInlineElement(
                getInlineElementAfter(this.rootNode, this.start)
            );
        }

        return this.startInline;
    }

    /**
     * Checks if a block completely falls in the selection
     * @param block The BlockElement to check
     */
    public isBlockInScope(block: BlockElement): boolean {
        if (!block) {
            return false;
        }
        let inScope = false;
        let selStartBlock = this.getStartBlockElement();
        if (this.start.equalTo(this.end)) {
            inScope = selStartBlock && selStartBlock.equals(block);
        } else {
            let selEndBlock = getBlockElementAtNode(this.rootNode, this.end.node);

            // There are three cases that are considered as "block in scope"
            // 1) The start of selection falls on the block
            // 2) The end of selection falls on the block
            // 3) the block falls in-between selection start and end
            inScope =
                selStartBlock &&
                selEndBlock &&
                (block.equals(selStartBlock) ||
                    block.equals(selEndBlock) ||
                    (block.isAfter(selStartBlock) && selEndBlock.isAfter(block)));
        }

        return inScope;
    }

    /**
     * Trim an incoming inline. If it falls completely outside selection, return null
     * otherwise return a partial that represents the portion that falls in the selection
     * @param inline The InlineElement to check
     */
    public trimInlineElement(inline: InlineElement): InlineElement {
        if (!inline || this.start.equalTo(this.end)) {
            return null;
        }

        // Temp code. Will be changed to using InlineElement.getStart/EndPosition() soon
        let start = Position.FromEditorPoint(inline.getStartPoint());
        let end = Position.FromEditorPoint(inline.getEndPoint());

        if (start.isAfter(this.end) || this.start.isAfter(end)) {
            return null;
        }

        if (this.start.isAfter(start)) {
            start = this.start;
        }

        if (end.isAfter(this.end)) {
            end = this.end;
        }

        return start.isAfter(end) || start.equalTo(end)
            ? null
            : start.offset > 0 || !end.isAtEnd
                ? new PartialInlineElement(
                      inline,
                      start.offset > 0 ? start.toEditorPoint() : null,
                      end.isAtEnd ? null : end.toEditorPoint()
                  )
                : inline;
    }
}

export default SelectionScoper;
