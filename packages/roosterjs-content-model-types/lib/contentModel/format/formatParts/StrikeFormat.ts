/**
 * Format of strikethrough
 */
export type StrikeFormat = {
    /**
     * Whether it has strike through
     */
    strikethrough?: boolean;

    /**
     * CSS line style for strikethrough, independent of underline.
     * An empty value uses the browser's single solid line.
     */
    strikethroughStyle?: string;
};
