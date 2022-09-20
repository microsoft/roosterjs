/**
 * Format of list thread id
 */
export type ListThreadFormat = {
    /**
     * When restart a new list thread, set this value to be the restart number.
     * Otherwise, leave it undefined to continue last list
     */
    startNumberOverride?: number;
};
