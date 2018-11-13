import { cacheGetNodeAtCursor } from './getNodeAtCursor';
import { DocumentCommand, FormatState, PluginEvent, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { getComputedStyles, getTagOfNode, Position } from 'roosterjs-editor-dom';

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
    let range = editor.getSelectionRange();
    let node = range && Position.getStart(range).normalize().node;
    let styles = node ? getComputedStyles(node) : [];
    let listTag = getTagOfNode(cacheGetNodeAtCursor(editor, event, ['OL', 'UL']));
    let headerTag = getTagOfNode(
        cacheGetNodeAtCursor(editor, event, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
    );
    let document = editor.getDocument();
    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],

        isBold: document.queryCommandState(DocumentCommand.Bold),
        isItalic: document.queryCommandState(DocumentCommand.Italic),
        isUnderline: document.queryCommandState(DocumentCommand.Underline),
        isStrikeThrough: document.queryCommandState(DocumentCommand.StrikeThrough),
        isSubscript: document.queryCommandState(DocumentCommand.Subscript),
        isSuperscript: document.queryCommandState(DocumentCommand.Superscript),

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
