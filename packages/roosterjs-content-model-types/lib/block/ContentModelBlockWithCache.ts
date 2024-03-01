/**
 * Represent a Content Model block with cached element
 */
export interface ContentModelBlockWithCache<TElement extends HTMLElement = HTMLElement> {
    /**
     * Cached element for reuse
     */
    cachedElement?: TElement;
}
