import InlineElement from './InlineElement';

/**
 * This refers to a "content block" in editor that serves as a content parsing boundary
 * It is most those html block like tags, i.e. <p>, <div>, <li>, <td> etc.
 * but can also be just a text node, followed by a <br>, i.e.
 * for html fragment <div>abc<br>123</div>, abc<br> is a block, 123 is another block
 */
export interface BlockElement {
    /**
     * Collapse this block element to a single DOM element.
     */
    collapseToSingleElement(): HTMLElement;

    /**
     * Get start node of this block element
     */
    getStartNode(): Node;

    /**
     * Get end node of this block element
     */
    getEndNode(): Node;

    /**
     * Check whether this block element equals to the given block element
     */
    equals(blockElement: BlockElement): boolean;

    /**
     * Checks if this block element is after another block element
     */
    isAfter(blockElement: BlockElement): boolean;

    /**
     * Check if the given node is within this block element
     */
    contains(node: Node): boolean;

    /**
     * @deprecated
     * Get text content of this block element
     */
    getTextContent(): string;

    /**
     * @deprecated
     * Get content nodes of this block element as node array
     */
    getContentNodes(): Node[];

    /**
     * @deprecated
     * Get the first inline element of this block element
     */
    getFirstInlineElement(): InlineElement;

    /**
     * @deprecated
     * Get the last inline element of this block element
     */
    getLastInlineElement(): InlineElement;

    /**
     * @deprecated
     * Get all inline elements inside this block element as array
     */
    getInlineElements(): InlineElement[];

    /**
     * @deprecated
     * Check if the given inline element falls within this block element
     */
    isInBlock(inlineElement: InlineElement): boolean;
}

export default BlockElement;
