import EdgeLinkPreview from '../browser/EdgeLinkPreview';

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
     */
    rawHtml: string;

    /**
     * @deprecated
     * Link Preview information provided by Edge
     */
    linkPreview?: EdgeLinkPreview;

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

    /**
     * Value of custom paste type. By default it is always empty.
     * To allow custom paste type, pass the allowed types to EditorOptions.allowedCustomPasteType
     */
    customValues: Record<string, string>;
}
