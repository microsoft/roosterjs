import InlineElementFactory from '../inlineElements/InlineElementFactory';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import editorPointEquals from '../utils/editorPointEquals';
import isEditorPointAfter from '../utils/isEditorPointAfter';
import normalizeEditorPoint from '../utils/normalizeEditorPoint';
import { BlockElement, EditorPoint, InlineElement } from 'roosterjs-editor-types';
import {
    getBlockElementAtNode,
    getInlineElementAfterPoint,
    getInlineElementBeforePoint,
} from '../blockElements/BlockElement';

// This is a utility like class that produces editor point/inline/block element around or within a selection range
class EditorSelection {
    private readonly startPoint: EditorPoint;
    private readonly endPoint: EditorPoint;

    private startInline: InlineElement;
    private endInline: InlineElement;
    private startEndCalculated: boolean = false;

    private startBlock: BlockElement;
    private endBlock: BlockElement;

    constructor(
        private rootNode: Node,
        private selectionRange: Range,
        private inlineElementFactory: InlineElementFactory
    ) {
        // compute the start and end point
        this.startPoint = normalizeEditorPoint(
            this.selectionRange.startContainer,
            this.selectionRange.startOffset
        );
        this.endPoint = this.selectionRange.collapsed
            ? this.startPoint
            : normalizeEditorPoint(this.selectionRange.endContainer, this.selectionRange.endOffset);
    }

    // Get the collapsed state of the selection
    public get collapsed(): boolean {
        return this.selectionRange.collapsed;
    }

    // Get the inline element before start of the selection
    public get inlineElementBeforeStart(): InlineElement {
        return getInlineElementBeforePoint(
            this.rootNode,
            this.startPoint,
            this.inlineElementFactory
        );
    }

    // Get the start inline element of the selection (the first inline after the selection)
    public get startInlineElement(): InlineElement {
        this.calculateStartEndIfNecessory();
        return this.startInline;
    }

    // Get the inline element at the end of the selection
    public get endInlineElement(): InlineElement {
        this.calculateStartEndIfNecessory();
        return this.endInline;
    }

    // Get start block element
    public get startBlockElement(): BlockElement {
        if (!this.startBlock && this.startPoint) {
            this.startBlock = getBlockElementAtNode(
                this.rootNode,
                this.startPoint.containerNode,
                this.inlineElementFactory
            );
        }

        return this.startBlock;
    }

    // Get end block element
    public get endBlockElement(): BlockElement {
        if (!this.endBlock && this.endPoint) {
            this.endBlock = getBlockElementAtNode(
                this.rootNode,
                this.endPoint.containerNode,
                this.inlineElementFactory
            );
        }

        return this.endBlock;
    }

    // Trim an inline element to ensure it fits in the selection boundary
    // Returns null if the inline element completely falls out of the selection
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        this.calculateStartEndIfNecessory();

        // Always return null for collapsed selection
        if (this.collapsed) {
            return null;
        }

        let trimmedInline: InlineElement;
        if (inlineElement && this.startInline && this.endInline) {
            // Start with the decorated inline, and trim first by startInline, and then endInline
            // if we end up getting a trimmed trimmedStartPoint or trimmedEndPoint, we know the new element
            // has to be partial. otherwise return a full inline
            let decoratedInline: InlineElement;
            let trimmedStartPoint: EditorPoint;
            let trimmedEndPoint: EditorPoint;

            // First unwrap inlineElement if it is partial
            if (inlineElement instanceof PartialInlineElement) {
                let partialInline = inlineElement as PartialInlineElement;
                decoratedInline = partialInline.getDecoratedInline();
                trimmedStartPoint = partialInline.isStartPartial()
                    ? partialInline.getStartPoint()
                    : null;
                trimmedEndPoint = partialInline.isEndPartial() ? partialInline.getEndPoint() : null;
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
                (this.startInline as PartialInlineElement).isStartPartial
            ) {
                // On same container, and startInline is a partial, compare start point
                if (
                    !trimmedStartPoint ||
                    isEditorPointAfter(this.startInline.getStartPoint(), trimmedStartPoint)
                ) {
                    // selection start is after the element, use selection start's as new start point
                    trimmedStartPoint = this.startInline.getStartPoint();
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
                    (this.endInline as PartialInlineElement).isEndPartial
                ) {
                    // On same container, and endInline is a partial, compare end point
                    if (
                        !trimmedEndPoint ||
                        isEditorPointAfter(trimmedEndPoint, this.endInline.getEndPoint())
                    ) {
                        // selection end is before the element, use selection end's as new end point
                        trimmedEndPoint = this.endInline.getEndPoint();
                    }
                }
            }

            // Conclusion
            if (decoratedInline != null) {
                // testing following conditions:
                // 1) both points are null, means it is full node, no need to decorate
                // 2) both points are not null and they actually point to same point, this isn't an invalid inline element, set null
                // 3) rest, create a new partial inline element
                if (!trimmedStartPoint && !trimmedEndPoint) {
                    trimmedInline = decoratedInline;
                } else {
                    trimmedInline =
                        trimmedStartPoint &&
                        trimmedEndPoint &&
                        editorPointEquals(trimmedStartPoint, trimmedEndPoint)
                            ? null
                            : new PartialInlineElement(
                                  decoratedInline,
                                  trimmedStartPoint,
                                  trimmedEndPoint
                              );
                }
            }
        }

        return trimmedInline;
    }

    // Check if a block is in scope
    // A block is considered in scope as long as it falls in the selection
    // or overlap with the selection start or end block
    public isBlockInScope(blockElement: BlockElement): boolean {
        this.calculateStartEndIfNecessory();

        let inScope = false;
        let selStartBlock = this.startBlockElement;
        if (this.collapsed) {
            inScope = !selStartBlock && selStartBlock.equals(blockElement);
        } else {
            let selEndBlock = this.endBlockElement;

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

    // Check if start and end inline has been calculated and do so if not
    private calculateStartEndIfNecessory(): void {
        if (!this.startEndCalculated) {
            this.calculateStartEndInline();
            this.startEndCalculated = true;
        }
    }

    // calculate start and end inline element
    private calculateStartEndInline(): void {
        // Compute the start point
        this.startInline = getInlineElementAfterPoint(
            this.rootNode,
            this.startPoint,
            this.inlineElementFactory
        );

        if (this.collapsed) {
            // For collapsed range, set end to be same as start
            this.endInline = this.startInline;
        } else {
            // For non-collapsed range, get same for end point
            this.endInline = getInlineElementBeforePoint(
                this.rootNode,
                this.endPoint,
                this.inlineElementFactory
            );

            // it is possible that start and end points to same inline element, which
            // is often the case where users select partial text of a text node
            // in that case, we want to fix startInline and endInline to be a partial inline element
            if (
                this.startInline &&
                this.endInline &&
                this.startInline.getContainerNode() == this.endInline.getContainerNode()
            ) {
                let fromPoint: EditorPoint;
                let decoratedInline: InlineElement;
                if (this.startInline instanceof PartialInlineElement) {
                    fromPoint = (this.startInline as PartialInlineElement).getStartPoint();
                    decoratedInline = (this
                        .startInline as PartialInlineElement).getDecoratedInline();
                } else {
                    decoratedInline = this.startInline;
                }

                let toPoint =
                    this.endInline instanceof PartialInlineElement
                        ? (this.endInline as PartialInlineElement).getEndPoint()
                        : null;
                this.startInline = this.endInline =
                    !fromPoint && !toPoint
                        ? decoratedInline
                        : new PartialInlineElement(decoratedInline, fromPoint, toPoint);
            }
        }
    }
}

export default EditorSelection;
