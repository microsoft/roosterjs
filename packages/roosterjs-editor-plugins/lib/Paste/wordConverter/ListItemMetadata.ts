/**
 * Holds the metadata of a Word list item... Specifically, the parsed values from
 * the "mso-list" style.
 */
export default interface ListItemMetadata {
    /** List item level under the list hierarchy */
    level: number;

    /** This is the complete list id we get from Word's metadata */
    wordListId: string;

    /**
     * This is the unique list id assigned to assigned to the list that holds
     * this list item.. This one is different from the Word List id, as word will
     * reuse valid list ids at different levels for different lists... This id
     * will identify these separate lists.
     */
    uniqueListId: number;

    /** Word list item node */
    originalNode: HTMLElement;
}
