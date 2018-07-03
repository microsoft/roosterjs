import getNodeAtCursor, { cacheGetNodeAtCursor } from '../cursor/getNodeAtCursor';
import { Editor } from 'roosterjs-editor-core';
import { FormatState, PluginEvent, QueryScope } from 'roosterjs-editor-types';
import { getComputedStyles, getTagOfNode } from 'roosterjs-editor-dom';

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
    let node = getNodeAtCursor(editor);
    let styles = getComputedStyles(node);
    let listTag = getTagOfNode(cacheGetNodeAtCursor(editor, event, ['OL', 'UL']));
    let headerTag = getTagOfNode(
        cacheGetNodeAtCursor(editor, event, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
    );
    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],

        isBold: queryCommandState(editor, 'bold'),
        isItalic: queryCommandState(editor, 'italic'),
        isUnderline: queryCommandState(editor, 'underline'),
        isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
        isSubscript: queryCommandState(editor, 'subscript'),
        isSuperscript: queryCommandState(editor, 'superscript'),

        isBullet: listTag == 'UL',
        isNumbering: listTag == 'OL',
        headerLevel: (headerTag && parseInt(headerTag[1])) || 0,

        canUnlink: !!editor.queryElements('a[href]', QueryScope.OnSelection)[0],
        canAddImageAltText: !!editor.queryElements('img', QueryScope.OnSelection)[0],
        isBlockQuote: !!editor.queryElements('blockquote', QueryScope.OnSelection)[0],

        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
    };
}
