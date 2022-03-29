import applyTextStyle from './applyTextStyle';
import createRange from '../selection/createRange';
import Position from '../selection/Position';
import { BlockElement, InlineElement, NodePosition, PositionType } from 'roosterjs-editor-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';

/**
 * This is a special version of inline element that identifies a section of an inline element
 * We often have the need to cut an inline element in half and perform some operation only on half of an inline element
 * i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
 * PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
 * It also offers some special methods that others don't have, i.e. nextInlineElement etc.
 */
export default class PartialInlineElement implements InlineElement {
    constructor(
        private inlineElement: InlineElement,
        private start: NodePosition | null = null,
        private end: NodePosition | null = null
    ) {}

    /**
     * Get the full inline element that this partial inline decorates
     */
    public getDecoratedInline(): InlineElement {
        return this.inlineElement;
    }

    /**
     * Gets the container node
     */
    public getContainerNode(): Node {
        return this.inlineElement.getContainerNode();
    }

    /**
     * Gets the parent block
     */
    public getParentBlock(): BlockElement {
        return this.inlineElement.getParentBlock();
    }

    /**
     * Gets the text content
     */
    public getTextContent(): string {
        let range = createRange(this.getStartPosition(), this.getEndPosition());

        return range.toString();
    }

    /**
     * Get start position of this inline element.
     */
    public getStartPosition(): NodePosition {
        return this.start || this.inlineElement.getStartPosition();
    }

    /**
     * Get end position of this inline element.
     */
    public getEndPosition(): NodePosition {
        return this.end || this.inlineElement.getEndPosition();
    }

    /**
     * Get next partial inline element if it is not at the end boundary yet
     */
    public get nextInlineElement(): PartialInlineElement | null {
        return this.end ? new PartialInlineElement(this.inlineElement, this.end) : null;
    }

    /**
     * Get previous partial inline element if it is not at the begin boundary yet
     */
    public get previousInlineElement(): PartialInlineElement | null {
        return this.start
            ? new PartialInlineElement(this.inlineElement, undefined, this.start)
            : null;
    }

    /**
     * Checks if it contains a position
     */
    public contains(pos: NodePosition): boolean {
        return pos && pos.isAfter(this.getStartPosition()) && this.getEndPosition().isAfter(pos);
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return this.inlineElement && this.inlineElement.isTextualInlineElement();
    }

    /**
     * Check if this inline element is after the other inline element
     */
    public isAfter(inlineElement: InlineElement): boolean {
        let thisStart = this.getStartPosition();
        let otherEnd = inlineElement && inlineElement.getEndPosition();
        return otherEnd && (thisStart.isAfter(otherEnd) || thisStart.equalTo(otherEnd));
    }

    /**
     * apply style
     */
    public applyStyle(styler: (element: HTMLElement, isInnerNode?: boolean) => any) {
        let from: NodePosition | null = this.getStartPosition().normalize();
        let to: NodePosition | null = this.getEndPosition().normalize();
        let container = this.getContainerNode();

        if (from.isAtEnd) {
            let nextNode = getNextLeafSibling(container, from.node);
            from = nextNode ? new Position(nextNode, PositionType.Begin) : null;
        }
        if (to.offset == 0) {
            let previousNode = getPreviousLeafSibling(container, to.node);
            to = previousNode ? new Position(previousNode, PositionType.End) : null;
        }

        applyTextStyle(container, styler, from || undefined, to || undefined);
    }
}
