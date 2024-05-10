/**
 * Type of Block in Content Model
 */
export type ContentModelBlockType =
    /**
     * Represent a Block Group
     */
    | 'BlockGroup'

    /**
     * Represent a Table
     */
    | 'Table'

    /**
     * Represent a general paragraph (DIV, P, ...)
     */
    | 'Paragraph'

    /**
     * Represent a block entity
     */
    | 'Entity'

    /**
     * Represents a horizontal divider element
     */
    | 'Divider';
