/**
 * Format of text-indent
 */
export type TextIndentFormat = {
    /**
     * Text indent of a paragraph
     */
    textIndent?: string;

    /**
     * Due to the special behavior of text-indent style, we need to know if this text-indent style is already applied to any child block.
     * Then after that, we can ignore it for the block at the same level.
     */
    isTextIndentApplied?: boolean;
};
