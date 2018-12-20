import DefaultFormat from './DefaultFormat';

/**
 * An object contains all related data for pasting
 */
interface ClipboardData {
    /**
     * An editor content snapshot before pasting happens. This is used for changing paste format
     */
    snapshotBeforePaste: string;

    /**
     * The format state at cursor before pasting. This is used for changing paste format
     */
    originalFormat: DefaultFormat;

    /**
     * Types of content included by the original onpaste event
     */
    types: string[];

    /**
     * If the copied data contains image format, this will be the image blob. Otherwise it is null.
     */
    image: File;

    /**
     * If the copied data contains plain text format, this will be the plain text string. Otherwise it is null.
     */
    text: string;

    /**
     * If the copied data contains HTML format, this will be the sanitized html string. Otherwise it is null.
     */
    html: string;

    /**
     * If the copied data contains HTML format, this will be the original html string without any processing. Otherwise it is null.
     */
    rawHtml: string;
}

export default ClipboardData;
