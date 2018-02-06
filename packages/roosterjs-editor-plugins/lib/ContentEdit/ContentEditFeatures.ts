/**
 * Feature set for ContentEdit plugin.
 * Call getDefaultContentEditFeatures() to get default feature set.
 */
interface ContentEditFeatures {
    /**
     * When press Tab in a list, indent current list item
     * @default true
     */
    indentWhenTab: boolean;

    /**
     * When press Shift+Tab in a list, outdent current list item
     * @default true
     */
    outdentWhenShiftTab: boolean;

    /**
     * When press BaskSpace on empty line which is the first item of a list, outdent current list item
     * @default true
     */
    outdentWhenBackspaceOnEmptyFirstLine: boolean;

    /**
     * When press Enter on empty line in a list, outdent current list item
     * @default true
     */
    outdentWhenEnterOnEmptyLine: boolean;

    /**
     * When press Backspace on first char in a list, make current item a new line of previous list item
     * @default false
     */
    mergeInNewLineWhenBackspaceOnFirstChar: boolean;

    /**
     * When press BAckspace on empty line which is the first line of a blockquote, unquote current line
     * @default true
     */
    unquoteWhenBackspaceOnEmptyFirstLine: boolean;

    /**
     * When press Enter on empty line in a blockquote, unquote current line
     * @default true
     */
    unquoteWhenEnterOnEmptyLine: boolean;

    /**
     * When press space after an asterik or number in an empty line, toggle bullet/numbering
     * @default true
     */
    autoBullet: boolean;
}

export default ContentEditFeatures;

/**
 * Get default feature set of ContentEdit plugin
 */
export function getDefaultContentEditFeatures(): ContentEditFeatures {
    return {
        indentWhenTab: true,
        outdentWhenShiftTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
    };
}
