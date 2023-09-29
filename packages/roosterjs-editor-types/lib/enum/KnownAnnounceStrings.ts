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
}
