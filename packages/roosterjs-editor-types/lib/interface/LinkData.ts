/**
 * LinkData represents a link match result
 */
interface LinkData {
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

export default LinkData;
