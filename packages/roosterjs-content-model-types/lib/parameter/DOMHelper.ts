/**
 * A helper class to provide DOM access APIs
 */
export interface DOMHelper {
    /**
     * Check if the given DOM node is in editor
     * @param node The node to check
     */
    isNodeInEditor(node: Node): boolean;

    /**
     * Check if the given DOM node is the editor
     * @param node The node to check
     */
    isNodeEditor(node: Node): boolean;

    /**
     * Query HTML elements in editor by tag name.
     * Be careful of this function since it will also return element under entity.
     * @param tag Tag name of the element to query
     * @returns HTML Element array of the query result
     */
    queryElements<TTag extends keyof HTMLElementTagNameMap>(
        tag: TTag
    ): HTMLElementTagNameMap[TTag][];

    /**
     * Query HTML elements in editor by a selector string
     * Be careful of this function since it will also return element under entity.
     * @param selector Selector string to query
     * @returns HTML Element array of the query result
     */
    queryElements(selector: string): HTMLElement[];

    /**
     * Get plain text content of editor using textContent property
     */
    getTextContent(): string;

    /**
     * Calculate current zoom scale of editor
     */
    calculateZoomScale(): number;

    /**
     * Set DOM attribute of editor content DIV
     * @param name Name of the attribute
     * @param value Value of the attribute
     */
    setDomAttribute(name: string, value: string | null): void;

    /**
     * Get DOM attribute of editor content DIV, null if there is no such attribute.
     * @param name Name of the attribute
     */
    getDomAttribute(name: string): string | null;

    /**
     * Get DOM style of editor content DIV
     * @param style Name of the style
     */
    getDomStyle<T extends keyof CSSStyleDeclaration>(style: T): CSSStyleDeclaration[T];

    /**
     * Find closest element ancestor start from the given node which matches the given selector
     * @param node Find ancestor start from this node
     * @param selector The expected selector. If null, return the first HTML Element found from start node
     * @returns An HTML element which matches the given selector. If the given start node matches the selector,
     * returns the given node
     */
    findClosestElementAncestor<T extends keyof HTMLElementTagNameMap>(
        node: Node,
        selector?: T
    ): HTMLElementTagNameMap[T] | null;

    /**
     * Find closest element ancestor start from the given node which matches the given selector
     * @param node Find ancestor start from this node
     * @param selector The expected selector. If null, return the first HTML Element found from start node
     * @returns An HTML element which matches the given selector. If the given start node matches the selector,
     * returns the given node
     */
    findClosestElementAncestor(node: Node, selector?: string): HTMLElement | null;

    /**
     * Check if the editor has focus now
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus(): boolean;
}
