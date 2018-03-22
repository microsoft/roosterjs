import BlockElement from '../blockElements/BlockElement';
import InlineElement from '../inlineElements/InlineElement';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import Position from '../selection/Position';
import SelectionRange from '../selection/SelectionRange';
import TraversingScoper from './TraversingScoper';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import {
    getInlineElementAfter,
    getInlineElementBefore,
} from '../inlineElements/getInlineElementBeforeAfter';

/**
 * This is selection scoper that provide a start inline as the start of the selection
 * and checks if a block falls in the selection (isBlockInScope)
 * last trimInlineElement to trim any inline element to return a partial that falls in the selection
 */
class SelectionScoper implements TraversingScoper {
    private startBlock: BlockElement;
    private startInline: InlineElement;
    private endInline: InlineElement;

    /**
     * Create a new instance of SelectionScoper class
     * @param rootNode The root node of the content
     * @param range The selection range to scope to
     */
    constructor(private rootNode: Node, private range: SelectionRange) {
        this.range = this.range.normalize();
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
            this.calculateStartEndInline();
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

        if (!this.startInline || !this.endInline) {
            this.calculateStartEndInline();
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
        // Always return null for collapsed selection
        if (!inlineElement || this.range.collapsed) {
            return null;
        }

        if (!this.startInline || !this.endInline) {
            this.calculateStartEndInline();
        }

        let trimmedInline: InlineElement;
        if (inlineElement && this.startInline && this.endInline) {
            // Start with the decorated inline, and trim first by startInline, and then endInline
            // if we end up getting a trimmed trimmedstartPosition or trimmedendPosition, we know the new element
            // has to be partial. otherwise return a full inline
            let decoratedInline: InlineElement;
            let trimmedStartPosition: Position;
            let trimmedEndPosition: Position;

            // First unwrap inlineElement if it is partial
            if (inlineElement instanceof PartialInlineElement) {
                decoratedInline = inlineElement.getDecoratedInline();
                trimmedStartPosition = inlineElement.isStartPartial()
                    ? inlineElement.getStartPosition()
                    : null;
                trimmedEndPosition = inlineElement.isEndPartial()
                    ? inlineElement.getEndPosition()
                    : null;
            } else {
                decoratedInline = inlineElement;
            }

            // Trim by start point
            if (this.startInline.isAfter(decoratedInline)) {
                // Out of scope
                decoratedInline = null;
            } else if (
                decoratedInline.getContainerNode() == this.startInline.getContainerNode() &&
                this.startInline instanceof PartialInlineElement &&
                this.startInline.isStartPartial()
            ) {
                // On same container, and startInline is a partial, compare start point
                if (
                    !trimmedStartPosition ||
                    this.startInline.getStartPosition().isAfter(trimmedStartPosition)
                ) {
                    // selection start is after the element, use selection start's as new start point
                    trimmedStartPosition = this.startInline.getStartPosition();
                }
            }

            // Trim by the end point
            if (decoratedInline != null) {
                if (decoratedInline.isAfter(this.endInline)) {
                    // Out of scope
                    decoratedInline = null;
                } else if (
                    decoratedInline.getContainerNode() == this.endInline.getContainerNode() &&
                    this.endInline instanceof PartialInlineElement &&
                    (this.endInline as PartialInlineElement).isEndPartial()
                ) {
                    // On same container, and endInline is a partial, compare end point
                    if (
                        !trimmedEndPosition ||
                        trimmedEndPosition.isAfter(this.endInline.getEndPosition())
                    ) {
                        // selection end is before the element, use selection end's as new end point
                        trimmedEndPosition = this.endInline.getEndPosition();
                    }
                }
            }

            // Conclusion
            if (decoratedInline != null) {
                // testing following conditions:
                // 1) both points are null, means it is full node, no need to decorate
                // 2) both points are not null and they actually point to same point, this isn't an invalid inline element, set null
                // 3) rest, create a new partial inline element
                if (!trimmedStartPosition && !trimmedEndPosition) {
                    trimmedInline = decoratedInline;
                } else {
                    trimmedInline =
                        trimmedStartPosition &&
                        trimmedEndPosition &&
                        trimmedStartPosition.equalTo(trimmedEndPosition)
                            ? null
                            : new PartialInlineElement(
                                  decoratedInline,
                                  trimmedStartPosition,
                                  trimmedEndPosition
                              );
                }
            }
        }

        return trimmedInline;
    }

    /**
     * calculate start and end inline element
     */
    private calculateStartEndInline() {
        // Compute the start point
        this.startInline = getInlineElementAfter(this.rootNode, this.range.start);

        if (this.range.collapsed) {
            // For collapsed range, set end to be same as start
            this.endInline = this.startInline;
        } else {
            // For non-collapsed range, get same for end point
            this.endInline = getInlineElementBefore(this.rootNode, this.range.end);

            // it is possible that start and end points to same inline element, which
            // is often the case where users select partial text of a text node
            // in that case, we want to fix startInline and endInline to be a partial inline element
            if (
                this.startInline &&
                this.endInline &&
                this.startInline.getContainerNode() == this.endInline.getContainerNode()
            ) {
                let fromPosition: Position;
                let decoratedInline: InlineElement;
                if (this.startInline instanceof PartialInlineElement) {
                    fromPosition = this.startInline.getStartPosition();
                    decoratedInline = this.startInline.getDecoratedInline();
                } else {
                    decoratedInline = this.startInline;
                }

                let toPosition =
                    this.endInline instanceof PartialInlineElement
                        ? this.endInline.getEndPosition()
                        : null;
                this.startInline = this.endInline =
                    !fromPosition && !toPosition
                        ? decoratedInline
                        : new PartialInlineElement(decoratedInline, fromPosition, toPosition);
            }
        }
    }
}

export default SelectionScoper;
