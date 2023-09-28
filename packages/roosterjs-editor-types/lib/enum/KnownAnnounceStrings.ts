/**
 * Known announce strings
 */
export enum KnownAnnounceStrings {
    /**
     * String announced when Indenting or Outdenting a list item,
     * @example
     * "Auto corrected, {0}"
     * Where {0} is the new list item bullet
     */
    AnnounceListItemNumberingIndentation = 1,
    /**
     * String announced when Indenting or Outdenting a list item,
     * @example
     * "Auto corrected bullet"
     */
    AnnounceListItemBulletIndentation,
}
