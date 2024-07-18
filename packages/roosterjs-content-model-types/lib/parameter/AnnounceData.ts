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

/**
 * Represents data, that can be used to announce text to screen reader.
 */
export interface AnnounceData {
    /**
     * @optional Default announce strings built in Rooster
     */
    defaultStrings?: KnownAnnounceStrings;

    /**
     * @optional string to announce from this Content Changed event, will be the fallback value if default string
     * is not provided or if it is not found in the strings map.
     */
    text?: string;

    /**
     * @optional if provided, will attempt to replace {n} with each of the values inside of the array.
     */
    formatStrings?: string[];

    /**
     * @optional if provided, will set the ariaLive property of the announce container element to the provided value.
     * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live#values
     */
    ariaLiveMode?: 'assertive' | 'polite' | 'off';
}
