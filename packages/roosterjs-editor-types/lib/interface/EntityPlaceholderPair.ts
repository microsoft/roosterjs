/**
 * Represent an object pair of Entity DOM node and placeholder comment node
 */
export interface EntityPlaceholderPair {
    /**
     * Wrapper element of element
     */
    entityWrapper: HTMLElement;

    /**
     * Placeholder comment node
     */
    placeholder: Comment;
}
