/**
 * The enum used for controlling the capitalization of text.
 * Used by changeCapitalization API
 */
export enum Capitalization {
    /**
     * Transforms the first character after punctuation mark followed by space
     * to uppercase and the rest of characters to lowercase.
     */
    Sentence = 'sentence',

    /**
     * Transforms all characters to lowercase
     */
    Lowercase = 'lowercase',

    /**
     * Transforms all characters to uppercase
     */
    Uppercase = 'uppercase',

    /**
     * Transforms the first character of each word to uppercase
     */
    CapitalizeEachWord = 'capitalize',
}
