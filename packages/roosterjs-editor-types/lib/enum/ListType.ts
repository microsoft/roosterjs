/**
 * Type of list (numbering or bullet)
 */
export const enum ListType {
    /**
     * None list type
     * It means this is not a list
     */
    None = 0,

    /**
     * Ordered List type (numbering list)
     * Represented by "OL" tag
     */
    Ordered = 1,

    /**
     * Unordered List type (bullet list)
     * Represented by "UL" tag
     */
    Unordered = 2,
}
