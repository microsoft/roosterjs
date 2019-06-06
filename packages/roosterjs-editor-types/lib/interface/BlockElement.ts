/**
 * This refers to a "content block" in editor that serves as a content parsing boundary
 * It is most those html block like tags, i.e. &lt;p&gt;, &lt;div&gt;, &lt;li&gt;, &lt;td&gt; etc.
 * but can also be just a text node, followed by a &lt;br&gt;, i.e.
 * for html fragment &lt;div&gt;abc&lt;br&gt;123&lt;/div&gt;, abc&lt;br&gt; is a block, 123 is another block
 */
export default interface BlockElement {
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
     * Get the text content of this block element
     */
    getTextContent(): string;
}
