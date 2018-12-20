import BlockElement from './BlockElement';
import EditorPoint from '../legacy/EditorPoint';
import NodePosition from './NodePosition';

/**
 * This refers to an inline element (as opposed to block) in editor
 * Inline and block makes the "type" system in editor.
 * An inline element is a maximum resolvable "entity" within the boundary of a block
 * At minimum and also most commonly, it represents a text node.
 * It can represent broader "content" depending on the resolvers that are available, i.e.
 * it can be anchor link, image, emoji, ...
 * Two rules:
 * 1) every inline element must have a container node (text or span, a etc.)
 * 2) inline element cannot be nested
 */
interface InlineElement {
    /**
     * Get the text content of this inline element
     */
    getTextContent(): string;

    /**
     * Get the container node of this inline element
     */
    getContainerNode(): Node;

    /**
     * Get the parent block element of this inline element
     */
    getParentBlock(): BlockElement;

    /**
     * Get the start position of this inline element
     */
    getStartPosition(): NodePosition;

    /**
     * Get the end position of this inline element
     */
    getEndPosition(): NodePosition;

    /**
     * Checks if the given inline element is after this inline element
     */
    isAfter(inlineElement: InlineElement): boolean;

    /**
     * Checks if this inline element is a textual inline element
     */
    isTextualInlineElement(): boolean;

    /**
     * Checks if the given editor position is contained in this inline element
     */
    contains(position: NodePosition | EditorPoint): boolean;

    /**
     * Apply inline style to a region of an inline element
     */
    applyStyle(styler: (element: HTMLElement) => any): void;

    /**
     * @deprecated
     * Get the start position of this inline element
     */
    getStartPoint(): EditorPoint;

    /**
     * @deprecated
     * Get the end position of this inline element
     */
    getEndPoint(): EditorPoint;
}

export default InlineElement;
