/**
 * An object contains all related data for pasting
 */
export default interface ClipboardData {
    /**
     * Available types from clipboard event
     */
    types: string[];

    /**
     * Plain text from clipboard event
     */
    text: string;

    /**
     * HTML string from clipboard event.
     * When set to null, it means there's no HTML from clipboard event.
     * When set to undefined, it means there may be HTML in clipboard event, but fail to retrieve
     */
    rawHtml: string;

    /**
     * Image file from clipboard event
     */
    image: File;

    /**
     * Html extracted from raw html string and remove content before and after fragment tag
     */
    html?: string;

    /**
     * An editor content snapshot before pasting happens. This is used for changing paste format
     */
    snapshotBeforePaste?: string;

    /**
     * BASE64 encoded data uri of the image if any
     */
    imageDataUri?: string;
}
