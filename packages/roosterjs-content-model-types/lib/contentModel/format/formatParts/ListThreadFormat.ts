/**
 * Format of list thread id
 */
export type ListThreadFormat = {
    /**
     * When restart a new list thread, set this value to be the restart number.
     * Otherwise, leave it undefined to continue last list
     */
    startNumberOverride?: number;

    /**
     * For a list item, it should have "list-item" (default value) for display style. In those case,
     * we will leave displayForDummyItem as undefined.
     * But if there is other value than "list-item" in display style, we store it here and treat this item
     * as a dummy item. Dummy item won't have list bullet or number, and we won't add 1 for list number for such items
     */
    displayForDummyItem?: string;
};
