import { ChangeSource, PluginDomEvent } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Feature set for ContentEdit plugin.
 * Call getDefaultContentEditFeatures() to get default feature set.
 */
interface ContentEditFeatures {
    /**
     * When press Tab/Shift+Tab in a list, indent/outdent current list item
     * @default true
     */
    indentOutdentWhenTab: boolean;

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
     * When press Space after an asterik in an empty line, create a bullet list
     * @default true
     */
    autoBullet: boolean;

    /**
     * When press Space or Enter after a hyperlink-like string, convert the string to a hyperlink
     */
    autoLink: boolean;

    /**
     * When press TAB or SHIFT+TAB key in table cell, jump to next/previous table cell
     * @default true
     */
    tabInTable: boolean;
}

export default ContentEditFeatures;

export interface ContentEditFeature {
    key: number;
    shouldHandleEvent: (
        event: PluginDomEvent,
        editor: Editor,
        backspaceUndoEventSource: ChangeSource
    ) => any;
    handleEvent: (event: PluginDomEvent, editor: Editor) => ChangeSource | void;
}

/**
 * Get default feature set of ContentEdit plugin
 */
export function getDefaultContentEditFeatures(): ContentEditFeatures {
    return {
        indentOutdentWhenTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        mergeInNewLineWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        autoBullet: true,
        autoLink: true,
        tabInTable: true,
    };
}
