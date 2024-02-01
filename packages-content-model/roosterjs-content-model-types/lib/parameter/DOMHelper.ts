/**
 * A helper class to provide DOM access APIs
 */
export interface DOMHelper {
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
     * Calculate current zoom scale of editor
     */
    calculateZoomScale(): number;
}
