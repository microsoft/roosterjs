/**
 * Type of list (numbering or bullet)
 */
// eslint-disable-next-line etc/no-const-enum
export enum CompatibleListType {
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
