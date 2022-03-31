import InlineElement from './InlineElement';

/**
 * The class that helps search content around a position
 */
export default interface IPositionContentSearcher {
    /**
     * Get the word before position. The word is determined by scanning backwards till the first white space, the portion
     * between position and the white space is the word before position
     * @returns The word before position
     */
    getWordBefore(): string;

    /**
     * Get the inline element before position
     * @returns The inlineElement before position
     */
    getInlineElementBefore(): InlineElement | null;

    /**
     * Get the inline element after position
     * @returns The inline element after position
     */
    getInlineElementAfter(): InlineElement | null;

    /**
     * Get X number of chars before position
     * The actual returned chars may be less than what is requested.
     * @param length The length of string user want to get, the string always ends at the position,
     * so this length determines the start position of the string
     * @returns The actual string we get as a sub string, or the whole string before position when
     * there is not enough chars in the string
     */
    getSubStringBefore(length: number): string;

    /**
     * Try to get a range matches the given text before the position
     * @param text The text to match against
     * @param exactMatch Whether it is an exact match
     * @returns The range for the matched text, null if unable to find a match
     */
    getRangeFromText(text: string, exactMatch: boolean): Range | null;

    /**
     * Get text section before position till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when position moves out of context etc.
     * @param stopFunc The callback stop function
     */
    forEachTextInlineElement(callback: (textInlineElement: InlineElement) => any): void;

    /**
     * Get first non textual inline element before position
     * @returns First non textual inline element before position or null if no such element exists
     */
    getNearestNonTextInlineElement(): InlineElement | null;
}
