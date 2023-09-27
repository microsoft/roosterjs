import type { DefaultAnnounceStrings } from '../enum/DefaultAnnounceStrings';

/**
 * Represents data, that can be used to announce text to screen reader.
 */
export default interface AnnounceData {
    /**
     * Default announce strings built in Rooster
     */
    defaultStrings?: DefaultAnnounceStrings;

    /**
     * @optional string to announce from this Content Changed event
     */
    text?: string;

    /**
     * @optional if provided, will attempt to replace {n} with each of the values inside of the array.
     */
    formatStrings?: string[];
}
