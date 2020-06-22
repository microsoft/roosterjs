/**
 * An interface to define a replacement rule for CustomReplace plugin
 */
export default interface Replacement {
    /**
     * Source string to replace from
     */
    sourceString: string;

    /**
     * HTML string to replace to
     */
    replacementHTML: string;

    /**
     * Whether the matching should be case sensitive
     */
    matchSourceCaseSensitive: boolean;
}
