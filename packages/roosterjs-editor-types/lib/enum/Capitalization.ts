/**
 * The enum used for controlling the capitalization of text.
 * Used by setCapitalization API
 */
export const enum Capitalization {
    /**
     * Transforms the first character of each word to uppercase
     */
    Capitalize = 'capitalize',

    /**
     * Transforms all characters to uppercase
     */
    Uppercase = 'uppercase',

    /**
     * Transforms all characters to lowercase
     */
    Lowercase = 'lowercase',
}
