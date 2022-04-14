/**
 * Represents the strategy to clear the format of the current editor selection
 */
export enum ClearFormatMode {
    /**
     * Inline format. Remove text format.
     */
    Inline,

    /**
     * BLock format. Remove text and structure format of the block.
     */
    Block,

    /**
     * Detect Inline or Block format based on the current editor selector.
     */
    AutoDetect,
}
