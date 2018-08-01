import isEditorPointAfter from '../utils/isEditorPointAfter';
import { BlockElement, EditorPoint, InlineElement } from 'roosterjs-editor-types';
import createRange from '../selection/createRange';
import Position from '../selection/Position';

/**
 * This is a special version of inline element that identifies a section of an inline element
 * We often have the need to cut an inline element in half and perform some operation only on half of an inline element
 * i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
 * PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
 * It also offers some special methods that others don't have, i.e. nextInlineElement etc.
 */
class PartialInlineElement implements InlineElement {
    constructor(
        private inlineElement: InlineElement,
        private startPoint: EditorPoint = null,
        private endPoint: EditorPoint = null
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
        let range = createRange(
            Position.FromEditorPoint(this.getStartPoint()),
            Position.FromEditorPoint(this.getEndPoint())
        );
        return range.toString();
    }

    /**
     * Gets the start point
     */
    public getStartPoint(): EditorPoint {
        return this.startPoint || this.inlineElement.getStartPoint();
    }

    /**
     * Gets the end point
     */
    public getEndPoint(): EditorPoint {
        return this.endPoint || this.inlineElement.getEndPoint();
    }

    /**
     * Get next partial inline element if it is not at the end boundary yet
     */
    public get nextInlineElement(): PartialInlineElement {
        return this.endPoint
            ? new PartialInlineElement(this.inlineElement, this.endPoint, null)
            : null;
    }

    /**
     * Get previous partial inline element if it is not at the begin boundary yet
     */
    public get previousInlineElement(): PartialInlineElement {
        return (
            this.startPoint && new PartialInlineElement(this.inlineElement, null, this.startPoint)
        );
    }

    /**
     * Checks if it contains an editor point
     */
    public contains(editorPoint: EditorPoint): boolean {
        return (
            isEditorPointAfter(editorPoint, this.getStartPoint()) &&
            isEditorPointAfter(this.getEndPoint(), editorPoint)
        );
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
        let thisStart = Position.FromEditorPoint(this.getStartPoint());
        let otherEnd = inlineElement && Position.FromEditorPoint(inlineElement.getEndPoint());
        return otherEnd && (thisStart.isAfter(otherEnd) || thisStart.equalTo(otherEnd));
    }

    /**
     * apply style
     */
    public applyStyle(
        styler: (element: HTMLElement) => any,
        fromPoint?: EditorPoint,
        toPoint?: EditorPoint
    ) {
        this.inlineElement.applyStyle(
            styler,
            fromPoint || this.startPoint,
            toPoint || this.endPoint
        );
    }
}

export default PartialInlineElement;
