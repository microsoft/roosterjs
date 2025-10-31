/**
 * Represents a helper that manages highlights in the editor
 */
export interface HighlightHelper {
    /**
     * Initialize the highlight helper
     * @param win The window object
     */
    initialize(win: Window): void;

    /**
     * Dispose the highlight helper and clear all highlights
     */
    dispose(): void;

    /*
     * Add ranges to be highlighted
     */
    addRanges(ranges: Range[]): void;

    /**
     * Clear all highlights
     */
    clear(): void;
}
