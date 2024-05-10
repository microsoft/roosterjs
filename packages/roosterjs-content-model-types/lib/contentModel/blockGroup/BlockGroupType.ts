/**
 * Type of Block Group in Content Model
 */
export type ContentModelBlockGroupType =
    /**
     * Represents the document entry of Content Model
     */
    | 'Document'

    /**
     * Represents a FormatContainer
     */
    | 'FormatContainer'

    /**
     * Represents a list item (LI) element
     */
    | 'ListItem'

    /**
     * Represents a table cell (TD, TH) element
     */
    | 'TableCell'

    /**
     * Represents a general HTML element that doesn't have a special type
     */
    | 'General';
