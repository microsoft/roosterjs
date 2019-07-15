import { cacheGetElementAtCursor, Editor } from 'roosterjs-editor-core';
import { getComputedStyles, getTagOfNode, Position } from 'roosterjs-editor-dom';
import {
    DocumentCommand,
    ElementBasedFormatState,
    FormatState,
    PendableFormatState,
    PluginEvent,
    QueryScope,
    StyleBasedFormatState,
} from 'roosterjs-editor-types';

type PendableFormatNames = keyof PendableFormatState;

const PendableFormatCommandMap: { [key in PendableFormatNames]: DocumentCommand } = {
    isBold: DocumentCommand.Bold,
    isItalic: DocumentCommand.Italic,
    isUnderline: DocumentCommand.Underline,
    isStrikeThrough: DocumentCommand.StrikeThrough,
    isSubscript: DocumentCommand.Subscript,
    isSuperscript: DocumentCommand.Superscript,
};

/**
 * Get Pendable Format State at cursor.
 * @param document The HTML Document to get format state from
 * @returns A PendableFormatState object which contains the values of pendable format states
 */
export function getPendableFormatState(document: Document): PendableFormatState {
    let keys = Object.keys(PendableFormatCommandMap) as PendableFormatNames[];

    return keys.reduce(
        (state, key) => {
            state[key] = document.queryCommandState(PendableFormatCommandMap[key]);
            return state;
        },
        <PendableFormatState>{}
    );
}

/**
 * Get element based Format State at cursor
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns An ElementBasedFormatState object
 */
export function getElementBasedFormatState(
    editor: Editor,
    event?: PluginEvent
): ElementBasedFormatState {
    let listTag = getTagOfNode(cacheGetElementAtCursor(editor, event, 'OL,UL'));
    let headerTag = getTagOfNode(cacheGetElementAtCursor(editor, event, 'H1,H2,H3,H4,H5,H6'));

    return {
        isBullet: listTag == 'UL',
        isNumbering: listTag == 'OL',
        headerLevel: (headerTag && parseInt(headerTag[1])) || 0,

        canUnlink: !!editor.queryElements('a[href]', QueryScope.OnSelection)[0],
        canAddImageAltText: !!editor.queryElements('img', QueryScope.OnSelection)[0],
        isBlockQuote: !!editor.queryElements('blockquote', QueryScope.OnSelection)[0],
    };
}

/**
 * Get style based Format State at cursor
 * @param editor The editor instance
 * @returns A StyleBasedFormatState object
 */
export function getStyleBasedFormatState(editor: Editor): StyleBasedFormatState {
    let range = editor.getSelectionRange();
    let node = range && Position.getStart(range).normalize().node;
    let styles = node ? getComputedStyles(node) : [];
    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],
    };
}

/**
 * Get format state at cursor
 * A format state is a collection of all format related states, e.g.,
 * bold, italic, underline, font name, font size, etc.
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns The format state at cursor
 */
export default function getFormatState(editor: Editor, event?: PluginEvent): FormatState {
    return {
        ...getPendableFormatState(editor.getDocument()),
        ...getElementBasedFormatState(editor, event),
        ...getStyleBasedFormatState(editor),
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
    };
}
