import { BlockElement, EditorPoint, InlineElement, NodePosition } from 'roosterjs-editor-types';
import { toEditorPoint } from '../deprecated/positionUtils';

/**
 * Represents an empty InlineElement.
 * This is used for ContentTraverser internally only.
 * An empty InlineElement means current position is at the end of a tag so nothing is included inside this element
 */
export default class EmptyInlineElement implements InlineElement {
    constructor(private position: NodePosition, private parentBlock: BlockElement) {}

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
    getStartPosition(): NodePosition {
        return this.position;
    }

    /**
     * Get the end position of this inline element
     */
    getEndPosition(): NodePosition {
        return this.position;
    }

    /**
     * Checks if the given inline element is after this inline element
     */
    isAfter(inlineElement: InlineElement): boolean {
        return inlineElement && this.position.isAfter(inlineElement.getEndPosition());
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
    contains(position: NodePosition | EditorPoint): boolean {
        return false;
    }

    /**
     * Apply inline style to a region of an inline element.
     */
    applyStyle(styler: (element: HTMLElement) => any): void {}

    /**
     * @deprecated
     * Get the start position of this inline element
     */
    getStartPoint(): EditorPoint {
        return toEditorPoint(this.position);
    }

    /**
     * @deprecated
     * Get the end position of this inline element
     */
    getEndPoint(): EditorPoint {
        return toEditorPoint(this.position);
    }
}
