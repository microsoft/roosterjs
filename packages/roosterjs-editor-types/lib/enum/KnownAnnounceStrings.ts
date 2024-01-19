/**
 * Known announce strings
 */
// eslint-disable-next-line etc/no-const-enum
export const enum KnownAnnounceStrings {
    /**
     * String announced for a list item in a OL List
     * @example
     * Auto corrected, &lcub;0&rcub;
     * Where &lcub0&rcub is the new list item bullet
     */
    AnnounceListItemNumbering = 1,
    /**
     * String announced for a list item in a UL List
     * @example
     * Auto corrected bullet
     */
    AnnounceListItemBullet,
    /**
     * String announced when cursor is moved to the last cell in a table
     */
    AnnounceOnFocusLastCell,
}
