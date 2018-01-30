import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { FormatState, ListState, NodeType, PluginEvent } from 'roosterjs-editor-types';
import { getComputedStyle } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import cacheGetListState from './cacheGetListState';
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
    // TODO: for background and color, shall we also use computed style?
    // TODO: for font size, we're not using computed style since it will size in PX while we want PT
    // We could possibly introduce some convertion from PX to PT so we can also use computed style
    // TODO: for BIU etc., we're using queryCommandState. Reason is users may do a Bold without first selecting anything
    // in that case, the change is not DOM and querying DOM won't give us anything. queryCommandState can read into browser
    // to figure out the state. It can be discussed if there is a better way since it has been seen that queryCommandState may throw error
    let nodeAtCursor = getNodeAtCursor(editor);

    if (!nodeAtCursor) {
        return null;
    }

    nodeAtCursor =
        nodeAtCursor && nodeAtCursor.nodeType == NodeType.Text
            ? nodeAtCursor.parentNode
            : nodeAtCursor;
    let styles = getComputedStyle(nodeAtCursor);

    let listState = cacheGetListState(editor, event);
    let headerLevel = cacheGetHeaderLevel(editor, event);
    return {
        fontName: styles[0],
        fontSize: styles[1],
        isBold: queryCommandState(editor, 'bold'),
        isItalic: queryCommandState(editor, 'italic'),
        isUnderline: queryCommandState(editor, 'underline'),
        isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
        isSubscript: queryCommandState(editor, 'subscript'),
        isSuperscript: queryCommandState(editor, 'superscript'),
        textColor: styles[2],
        backgroundColor: styles[3],
        isBullet: listState == ListState.Bullets,
        isNumbering: listState == ListState.Numbering,
        canUnlink: queryNodesWithSelection(editor, 'a[href]').length > 0,
        canAddImageAltText: queryNodesWithSelection(editor, 'img').length > 0,
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
        isBlockQuote: queryNodesWithSelection(editor, 'blockquote').length > 0,
        headerLevel: headerLevel,
    };
}
