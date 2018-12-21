/**
 * Represents items retrieved from clipboard event
 */
export default interface ClipboardItems {
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
    html: string;

    /**
     * Image file from clipboard event
     */
    image: File;
}
