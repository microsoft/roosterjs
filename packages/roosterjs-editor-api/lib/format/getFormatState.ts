import { getTagOfNode } from 'roosterjs-editor-dom';
import {
    ElementBasedFormatState,
    FormatState,
    IEditor,
    PluginEvent,
    QueryScope,
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
    editor: IEditor,
    event?: PluginEvent
): ElementBasedFormatState {
    let listTag = getTagOfNode(editor.getElementAtCursor('OL,UL', null /*startFrom*/, event));
    let headerTag = getTagOfNode(
        editor.getElementAtCursor('H1,H2,H3,H4,H5,H6', null /*startFrom*/, event)
    );

    return {
        isBullet: listTag == 'UL',
        isNumbering: listTag == 'OL',
        headerLevel: (headerTag && parseInt(headerTag[1])) || 0,
        canUnlink: !!editor.queryElements('a[href]', QueryScope.OnSelection)[0],
        canAddImageAltText: !!editor.queryElements('img', QueryScope.OnSelection)[0],
        isBlockQuote: !!editor.queryElements('blockquote', QueryScope.OnSelection)[0],
        isInTable: !!editor.queryElements('table', QueryScope.OnSelection)[0],
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
export default function getFormatState(editor: IEditor, event?: PluginEvent): FormatState {
    return {
        ...editor.getPendableFormatState(false /* forceGetStateFromDom */),
        ...getElementBasedFormatState(editor, event),
        ...editor.getStyleBasedFormatState(),
        ...editor.getUndoState(),
        isDarkMode: editor.isDarkMode(),
        zoomScale: editor.getZoomScale(),
    };
}
