import { cacheGetElementAtCursor, Editor } from 'roosterjs-editor-core';
import { getComputedStyles, getTagOfNode, Position } from 'roosterjs-editor-dom';
import { getPendableFormatState } from 'roosterjs-editor-dom';
import {
    ElementBasedFormatState,
    FormatState,
    PluginEvent,
    QueryScope,
    StyleBasedFormatState,
} from 'roosterjs-editor-types';

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
    const range = editor.getSelectionRange();
    const node = range && Position.getStart(range).normalize().node;
    const styles = node ? getComputedStyles(node) : [];
    const isDarkMode = editor.isDarkMode();
    const ogTextColorNode =
        isDarkMode &&
        (editor.getElementAtCursor('[data-ogsc]', node) ||
            editor.getElementAtCursor('[data-ogac]', node));
    const ogBackgroundColorNode =
        isDarkMode &&
        (editor.getElementAtCursor('[data-ogsb]', node) ||
            editor.getElementAtCursor('[data-ogab]', node));

    return {
        fontName: styles[0],
        fontSize: styles[1],
        textColor: styles[2],
        backgroundColor: styles[3],
        textColors: ogTextColorNode
            ? {
                  darkModeColor: styles[2],
                  lightModeColor: ogTextColorNode.dataset.ogsc || ogTextColorNode.dataset.ogac,
              }
            : undefined,
        backgroundColors: ogBackgroundColorNode
            ? {
                  darkModeColor: styles[3],
                  lightModeColor: ogTextColorNode.dataset.ogsb || ogTextColorNode.dataset.ogab,
              }
            : undefined,
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
