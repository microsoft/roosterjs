/**
 * The link preview pasted info provided by Edge
 */
export default interface EdgeLinkPreview {
    /**
     * Domain of the source page
     */
    domain: string;

    /**
     * Preferred paste format
     */
    preferred_format: string;

    /**
     * Title of the source page
     */
    title: string;

    /**
     * Type of the paste content
     */
    type: string;

    /**
     * Url of the source page
     */
    url: string;
}
