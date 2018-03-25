import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { FormatState, PluginEvent } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import cacheGetListTag from '../cursor/cacheGetListTag';
import cacheGetHeaderLevel from './cacheGetHeaderLevel';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';

// Query command state, used for query Bold, Italic, Underline state
function queryCommandState(editor: Editor, command: string): boolean {
    return editor.getDocument().queryCommandState(command);
}

/**
 * Get format state at cursor
 * A format state is a collection of all format related states, e.g.,
 * bold, italic, underline, font name, font size, etc.
 * @param editor The editor
 * @param (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns The format state at cursor
 */
export default function getFormatState(editor: Editor, event?: PluginEvent): FormatState {
    let nodeAtCursor = getNodeAtCursor(editor);

    if (!nodeAtCursor) {
        return null;
    }

    let styles = getComputedStyles(nodeAtCursor);
    let tag = cacheGetListTag(editor, event);
    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],

        isBullet: tag == 'UL',
        isNumbering: tag == 'OL',

        isBold: queryCommandState(editor, 'bold'),
        isItalic: queryCommandState(editor, 'italic'),
        isUnderline: queryCommandState(editor, 'underline'),
        isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
        isSubscript: queryCommandState(editor, 'subscript'),
        isSuperscript: queryCommandState(editor, 'superscript'),

        canUnlink: queryNodesWithSelection(editor, 'a[href]').length > 0,
        canAddImageAltText: queryNodesWithSelection(editor, 'img').length > 0,
        isBlockQuote: queryNodesWithSelection(editor, 'blockquote').length > 0,

        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
        headerLevel: cacheGetHeaderLevel(editor, event),
    };
}
