/**
 * Type of Block Group in Content Model
 */
export const enum ContentModelBlockGroupType {
    /**
     * Represents the document entry of Content Model
     */
    Document,

    /**
     * Represents a table cell (TD, TH) element
     */
    TableCell,

    /**
     * Represents a general HTML element that doesn't have a special type
     */
    General,
}
