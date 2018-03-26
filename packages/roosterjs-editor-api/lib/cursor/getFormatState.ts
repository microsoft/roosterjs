import cacheGetListTag from '../cursor/cacheGetListTag';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';
import { FormatState, PluginEvent } from 'roosterjs-editor-types';
import { cacheGetEventData } from 'roosterjs-editor-core';
import { getComputedStyles } from 'roosterjs-editor-dom';

/**
 * Get the header level in current selection. The header level refers to the HTML <H1> to <H6> elements,
 * level 1 indicates <H1>, level 2 indicates <H2>, etc
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the node within selection
 * @returns The header level, 0 if there is no HTML heading elements
 */
function cacheGetHeaderLevel(editor: Editor, event?: PluginEvent): number {
    return cacheGetEventData<number>(event, 'HeaderLevel', () => {
        for (let i = 1; i <= 6; i++) {
            if (queryNodesWithSelection(editor, 'H' + i).length > 0) {
                return i;
            }
        }
        return 0;
    });
}

/**
 * Query command state, used for query Bold, Italic, Underline state
 * @param editor The editor instance
 * @param command The command to query
 */
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
