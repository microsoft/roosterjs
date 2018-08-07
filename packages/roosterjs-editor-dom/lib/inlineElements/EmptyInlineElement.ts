import Position from '../selection/Position';
import isEditorPointAfter from '../utils/isEditorPointAfter';
import { BlockElement, EditorPoint, InlineElement } from 'roosterjs-editor-types';

/**
 * Represents an empty InlineElement.
 * This is used for ContentTraverser internally only.
 * An empty InlineElement means current position is at the end of a tag so nothing is included inside this element
 */
export default class EmptyInlineElement implements InlineElement {
    constructor(private position: Position, private parentBlock: BlockElement) {}

    /**
     * Get the text content of this inline element
     */
    getTextContent(): string {
        return '';
    }

    /**
     * Get the container node of this inline element
     */
    getContainerNode(): Node {
        return this.position.node;
    }

    /**
     * Get the parent block element of this inline element
     */
    getParentBlock(): BlockElement {
        return this.parentBlock;
    }

    /**
     * Get the start position of this inline element
     */
    getStartPoint(): EditorPoint {
        return this.position.toEditorPoint();
    }

    /**
     * Get the end position of this inline element
     */
    getEndPoint(): EditorPoint {
        return this.position.toEditorPoint();
    }

    /**
     * Get the position of this inline element
     */
    getPosition(): Position {
        return this.position;
    }

    /**
     * Checks if the given inline element is after this inline element
     */
    isAfter(inlineElement: InlineElement): boolean {
        return isEditorPointAfter(this.position.toEditorPoint(), inlineElement.getEndPoint());
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    isTextualInlineElement(): boolean {
        return false;
    }

    /**
     * Checks if the given editor position is contained in this inline element
     */
    contains(position: EditorPoint): boolean {
        return false;
    }

    /**
     * Apply inline style to a region of an inline element.
     */
    applyStyle(
        styler: (element: HTMLElement) => any,
        fromPoint?: EditorPoint,
        toPoint?: EditorPoint
    ): void {}
}
