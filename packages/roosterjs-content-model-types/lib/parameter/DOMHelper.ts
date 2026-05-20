import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { DarkColorHandler } from '../context/DarkColorHandler';

/**
 * A helper class to provide DOM access APIs
 */
export interface DOMHelper {
    /**
     * Check if the given DOM node is in editor
     * @param node The node to check
     * @param excludeRoot When pass true, the function will return false if the passed in node is the root node itself
     */
    isNodeInEditor(node: Node, excludeRoot?: boolean): boolean;

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
     * Find the closest block element ancestor from the given node within current editing scope
     * @param startFrom The node to start the search from
     * @returns The closest block element ancestor
     */
    findClosestBlockElement(startFrom: Node): HTMLElement;

    /**
     * Check if the editor has focus now
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus(): boolean;

    /**
     * Check if the root element is in RTL mode
     */
    isRightToLeft(): boolean;

    /**
     * Get the width of the editable area of the editor content div
     */
    getClientWidth(): number;

    /**
     * Get a deep cloned root element
     */
    getClonedRoot(): HTMLElement;

    /**
     * Get format of the container element
     * @param isInDarkMode Optional flag to indicate if the environment is in dark mode
     * @param darkColorHandler Optional DarkColorHandler to retrieve dark mode colors
     */
    getContainerFormat(
        isInDarkMode?: boolean,
        darkColorHandler?: DarkColorHandler
    ): ContentModelSegmentFormat;

    /**
     * Get text ranges by searching for a specific text, with options to match case and whole word.
     * This will only search within editable elements.
     * @param text The text to search for
     * @param matchCase Whether to match case
     * @param wholeWord Whether to match whole word
     * @returns An array of Ranges that match the search criteria
     */
    getRangesByText(text: string, matchCase: boolean, wholeWord: boolean): Range[];

    /**
     * Get the current selection. In shadow DOM, delegates to the resolved
     * selection adapter (getComposedRanges → shadowRoot.getSelection → document.getSelection).
     */
    getSelection(): Selection | null;

    /**
     * Get the current selection range, handling shadow DOM StaticRange conversion.
     * Returns a live Range in all browsers.
     */
    getSelectionRange(): Range | null;

    /**
     * Set the selection to the given range, handling browser differences for shadow DOM.
     * @param range The range to set
     * @param isReverted Whether the selection is reverted (focus before anchor)
     */
    setSelectionRange(range: Range, isReverted?: boolean): void;

    /**
     * Detect if the current selection is reverted (focus before anchor).
     * In shadow DOM with getComposedRanges, returns false since StaticRange has no direction.
     */
    isSelectionReverted(): boolean;

    /**
     * Append an element to the correct root container (shadow root or document.body)
     * @param element The element to append
     */
    appendToRoot(element: HTMLElement): void;

    /**
     * Get the shadow root if the editor content div is inside a shadow DOM, null otherwise.
     */
    getShadowRoot(): ShadowRoot | null;
}
