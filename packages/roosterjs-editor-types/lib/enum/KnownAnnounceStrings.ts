/**
 * Known announce strings
 */
export const enum KnownAnnounceStrings {
    /**
     * String announced when Indenting or Outdenting a list item in a OL List
     * @example
     * Auto corrected, &lcub;0&rcub;
     * Where &lcub0&rcub is the new list item bullet
     */
    AnnounceListItemNumberingIndentation = 1,
    /**
     * String announced when Indenting or Outdenting a list item in a UL List
     * @example
     * Auto corrected bullet
     */
    AnnounceListItemBulletIndentation,
    /**
     * String announced when cursor is moved to the last cell in a table
     */
    AnnounceOnFocusLastCell,
    /**
     * String announced when a new list item is created.
     */
    AnnounceNewListItemNumber,
}
