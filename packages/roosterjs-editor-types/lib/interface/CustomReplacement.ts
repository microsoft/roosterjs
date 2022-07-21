import IEditor from './IEditor';

/**
 * An interface to define a replacement rule for CustomReplace plugin
 */
export default interface CustomReplacement {
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

    /**
     * A callback to check if the string should be replaced
     * @param content the content where the string is
     * @param replacement string to be replaced
     * @param sourceEditor reference to the editor, allows for more complex replacement rules
     * @return true, if the string should be replaced, else return false
     */
    shouldReplace?: (
        replacement: CustomReplacement,
        content: string,
        sourceEditor?: IEditor
    ) => boolean;
}
