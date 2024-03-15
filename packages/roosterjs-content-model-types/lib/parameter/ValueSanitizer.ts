/**
 * Specify how to sanitize a value, can be a callback function or a boolean value.
 * True: Keep this value
 * False: Remove this value
 * A callback: Let the callback function to decide how to deal this value.
 * @param value The original value
 * @param tagName Tag name of the element of this value
 * @returns Return a non-empty string means use this value to replace the original value. Otherwise remove this value
 */
export type ValueSanitizer = ((value: string, tagName: string) => string | null) | boolean;
