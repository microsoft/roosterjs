/**
 * Data of the matched link
 */
export interface LinkData {
    /**
     * Schema of a hyperlink
     */
    scheme: string;

    /**
     * Original url of a hyperlink
     */
    originalUrl: string;

    /**
     * Normalized url of a hyperlink
     */
    normalizedUrl: string;
}
