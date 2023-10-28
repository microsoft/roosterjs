/**
 * Known announce strings
 */
export type KnownAnnounceStrings =
    /**
     * String announced for a list item in a OL List
     * @example
     * Auto corrected, {0}
     * Where {0} is the new list item bullet
     */
    | 'announceListItemNumbering'
    /**
     * String announced for a list item in a UL List
     * @example
     * Auto corrected bullet
     */
    | 'announceListItemBullet'
    /**
     * String announced when cursor is moved to the last cell in a table
     */
    | 'announceOnFocusLastCell';
