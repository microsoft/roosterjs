/**
 * Represents a table and its container (logical root)
 */
export interface TableWithRoot {
    /**
     * The table element
     */
    table: HTMLTableElement;
    /**
     * The logical root element of the table
     * This is the element that contains the table and all its ancestors
     * It is used to determine the logical root of the table
     */
    logicalRoot: HTMLDivElement | null;
}
