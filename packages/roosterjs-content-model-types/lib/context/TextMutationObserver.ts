/**
 * A wrapper of MutationObserver to observe text change from editor
 */
export interface TextMutationObserver {
    /**
     * Start observing mutations from editor
     */
    startObserving(): void;

    /**
     * Stop observing mutations from editor
     */
    stopObserving(): void;

    /**
     * Flush all pending mutations and update cached model if need
     * @param ignoreMutations When pass true, all mutations will be ignored and do not update content model.
     * This should only be used when we already have a up-to-date content model and will set it as latest cache
     */
    flushMutations(ignoreMutations?: boolean): void;
}
