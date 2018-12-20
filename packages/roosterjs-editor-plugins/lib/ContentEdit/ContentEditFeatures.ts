import { ChangeSource, PluginEvent, PluginKeyboardEvent } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

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

    /**
     * When press TAB or SHIFT+TAB key in table cell, jump to next/previous table cell
     * @default true
     */
    tabInTable: boolean;

    /**
     * When press Up or Down in table cell, jump to the table cell above/below
     * @default true
     */
    upDownInTable: boolean;

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
     * When generate ordered list, the list bullet will variare according its nesting level, in a loop of '1', 'a', 'i'
     * @default false
     */
    smartOrderedList: boolean;

    /**
     * A style list for smart ordered list. This value is only effective when smartOrderedList is true
     * @default ['lower-alpha', 'lower-roman', 'decimal']
     */
    smartOrderedListStyles: string[];
}

export default ContentEditFeatures;

/**
 * Get default feature set of ContentEdit plugin
 */
export function getDefaultContentEditFeatures(): ContentEditFeatures {
    return {
        autoLink: true,
        indentWhenTab: true,
        outdentWhenShiftTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
        tabInTable: true,
        upDownInTable: true,
        defaultShortcut: true,
        unlinkWhenBackspaceAfterLink: false,
        smartOrderedList: false,
        smartOrderedListStyles: ['lower-alpha', 'lower-roman', 'decimal'],
    };
}

export interface GenericContentEditFeature<TEvent extends PluginEvent> {
    keys: number[];
    initialize?: (editor: Editor) => any;
    featureFlag: keyof ContentEditFeatures;
    shouldHandleEvent: (event: TEvent, editor: Editor) => any;
    handleEvent: (event: TEvent, editor: Editor) => ChangeSource | void;
    allowFunctionKeys?: boolean;
}

export type ContentEditFeature = GenericContentEditFeature<PluginKeyboardEvent>;

export const enum Keys {
    NULL = 0,
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SPACE = 32,
    UP = 38,
    DOWN = 40,
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    COMMA = 188,
    PERIOD = 190,
    FORWARDSLASH = 191,
    Ctrl = 0x100,
    Meta = 0x200,
    Shift = 0x400,
    CONTENTCHANGED = 0x800,
}
