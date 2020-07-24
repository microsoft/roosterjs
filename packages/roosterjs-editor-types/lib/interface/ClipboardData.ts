import ClipboardItems from './ClipboardItems';

/**
 * An object contains all related data for pasting
 */
export default interface ClipboardData extends ClipboardItems {
    /**
     * An editor content snapshot before pasting happens. This is used for changing paste format
     */
    snapshotBeforePaste: string;

    /**
     * BASE64 encoded data uri of the image if any
     */
    imageDataUri: string;
}
