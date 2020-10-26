/**
 * Settings for auto link features
 */
export interface AutoLinkFeatureSettings {
    /**
     * When press Space or Enter after a hyperlink-like string, convert the string to a hyperlink
     * @default true
     */
    autoLink: boolean;

    /**
     * Unlink when backspace right after a hyperlink
     * @default false
     */
    unlinkWhenBackspaceAfterLink: boolean;
}

/**
 * Settings for cursor features
 */
export interface CursorFeatureSettings {
    /**
     * Chrome may make the cursor move the then end of document if press Ctrl+Left at the beginning of document
     * Let's disable this behaivor
     * @default true
     */
    noCycleCursorMove: boolean;
}

/**
 * Settings for entity features
 */
export interface EntityFeatureSettings {
    /**
     * A content edit feature to trigger EntityOperation event with operation "Click" when user
     * clicks on a readonly entity.
     */
    clickOnEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "Escape" when user
     * presses ESC on a readonly entity.
     */
    escapeFromEntity: boolean;

    /**
     * A content edit feature to split current line into two lines at the cursor when user presses
     * ENTER right before a readonly entity.
     * Browser's default behavior will insert an extra BR tag before the entity which causes an extra
     * empty line. So we override the default behavior here.
     */
    enterBeforeReadonlyEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "RemoveFromEnd" when user
     * press BACKSPACE right after an entity
     */
    backspaceAfterEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "RemoveFromStart" when user
     * press DELETE right after an entity
     */
    deleteBeforeEntity: boolean;
}

/**
 * Settings for list features
 */
export interface ListFeatureSettings {
    /**
     * When press space after an asterik or number in an empty line, toggle bullet/numbering
     * @default true
     */
    autoBullet: boolean;

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
     * When edit with lists, maintain the list numbers of list chain
     */
    maintainListChain: boolean;
}

/**
 * Settings for mark down features
 */
export interface MarkdownFeatureSettings {
    /**
     * When typing text surrounded by '*', the symbols will be removed and the text will be bolded.
     * @default true
     */
    markdownBold: boolean;

    /**
     * When typing text surrounded by '_', the symbols will be removed and the text will be italicized.
     * @default true
     */
    markdownItalic: boolean;

    /**
     * When typing text surrounded by '~', the symbols will be removed and the text will be striked through.
     * @default true
     */
    markdownStrikethru: boolean;

    /**
     * When typing text surrounded by '`', the symbols will be removed and the text will be wrapped in a code tag.
     * @default true
     */
    markdownInlineCode: boolean;
}

/**
 * Settings for quote features
 */
export interface QuoteFeatureSettings {
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
}

/**
 * Settings for shortcut features
 */
export interface ShortcutFeatureSettings {
    /**
     * Respond to default common keyboard short, i.e. Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y
     * @default true
     */
    defaultShortcut: boolean;
}

/**
 * Settings for structured node features
 */
export interface StructuredNodeFeatureSettings {
    /**
     * When press Enter at the beginning of first structured element (table, list) and there isn't line before the position
     * we create a new line before so that user got a chance to enter content before the table or list
     * @default false
     */
    insertLineBeforeStructuredNodeFeature: boolean;
}

/**
 * Settings for table features
 */
export interface TableFeatureSettings {
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
}

/**
 * A list to specify whether each of the listed content edit features is enabled
 */
export default interface ContentEditFeatureSettings
    extends ListFeatureSettings,
        QuoteFeatureSettings,
        TableFeatureSettings,
        StructuredNodeFeatureSettings,
        AutoLinkFeatureSettings,
        ShortcutFeatureSettings,
        CursorFeatureSettings,
        MarkdownFeatureSettings,
        EntityFeatureSettings {}
