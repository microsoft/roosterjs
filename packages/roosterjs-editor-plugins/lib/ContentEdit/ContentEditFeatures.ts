import { Browser } from 'roosterjs-editor-dom';

/**
 * Feature set for ContentEdit plugin.
 * Call getDefaultContentEditFeatures() to get default feature set.
 */
export default interface ContentEditFeatures {
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
     * @default true for IE, false for other browsers since they have already had the behavior
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

    /**
     * When press TAB or SHIFT+TAB key in table cell, jump to next/previous table cell
     * @default true
     */
    tabInTable: boolean;

    /**
     * When press Up or Down in table cell, jump to the table cell above/below
     * @default true for Chrome and safari, false for other browsers since they arleady have correct behavior
     */
    upDownInTable: boolean;

    /**
     * When press Enter at the beginning of first structured element (table, list) and there isn't line before the position
     * we create a new line before so that user got a chance to enter content before the table or list
     * @default false
     */
    insertLineBeforeStructuredNodeFeature: boolean;

    /**
     * When press Space or Enter after a hyperlink-like string, convert the string to a hyperlink
     * @default true
     */
    autoLink: boolean;

    /**
     * Respond to default common keyboard short, i.e. Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y
     * @default true
     */
    defaultShortcut: boolean;

    /**
     * Unlink when backspace right after a hyperlink
     * @default false
     */
    unlinkWhenBackspaceAfterLink: boolean;

    /**
     * Chrome may make the cursor move the then end of document if press Ctrl+Left at the beginning of document
     * Let's disable this behaivor
     */
    noCycleCursorMove: boolean;

    /**
     * When generate ordered list, the list bullet will variare according its nesting level, in a loop of '1', 'a', 'i'
     * @default false
     */
    smartOrderedList: boolean;

    /**
     * A style list for smart ordered list. This value is only effective when smartOrderedList is true
     * @default ['lower-alpha', 'lower-roman', 'decimal']
     */
    smartOrderedListStyles: string[];

    /**
     * Bolds text when surrounded by asterisks
     * @default true
     */
    bold: boolean;

    /**
     * Makes texts italic when surrounded by underscores
     * @default true
     */
    italic: boolean;

    /**
     * Underlines text when surrounded by plus signs
     * @default true
     */
    underline: boolean;

    /**
     * Strikes through text when surrounded by tildes
     * @default true
     */
    strikethrough: boolean;
}

/**
 * Get default feature set of ContentEdit plugin
 */
export function getDefaultContentEditFeatures(): ContentEditFeatures {
    return {
        autoLink: true,
        indentWhenTab: true,
        outdentWhenShiftTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: Browser.isIE || Browser.isChrome,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
        tabInTable: true,
        upDownInTable: Browser.isChrome || Browser.isSafari,
        insertLineBeforeStructuredNodeFeature: false,
        defaultShortcut: true,
        unlinkWhenBackspaceAfterLink: false,
        noCycleCursorMove: Browser.isChrome,
        smartOrderedList: false,
        smartOrderedListStyles: ['lower-alpha', 'lower-roman', 'decimal'],
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
    };
}
