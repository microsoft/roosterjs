import type { KnownAnnounceStrings } from '../enum/KnownAnnounceStrings';

/**
 * Represents data, that can be used to announce text to screen reader.
 */
export default interface AnnounceData {
    /**
     * Default announce strings built in Rooster
     */
    defaultStrings?: KnownAnnounceStrings;

    /**
     * @optional string to announce from this Content Changed event
     */
    text?: string;

    /**
     * @optional if provided, will attempt to replace {n} with each of the values inside of the array.
     */
    formatStrings?: string[];
}
