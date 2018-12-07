import { cacheGetElementAtCursor, cacheGetEventData, Editor } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';

/**
 * @deprecated Use editor.getElementAtCursor()
 * Get the node at selection. If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param expectedTags The expected tag names. If null, return the element at cursor
 * @param startNode If specified, use this node as start node to search instead of current node
 * @returns The node at cursor or the nearest ancestor with the tag name is specified
 */
export default function getNodeAtCursor(
    editor: Editor,
    expectedTags?: string | string[],
    startNode?: Node
): HTMLElement {
    let selector = expectedTags instanceof Array ? expectedTags.join(',') : expectedTags;
    return editor.getElementAtCursor(selector, startNode);
}

/**
 * @deprecated Use cacheGetElementAtCursor instead
 * Get the node at selection from event cache if it exists.
 * If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param event Event object to get cached object from
 * @param expectedTags The expected tag names. If null, return the element at cursor
 * @returns The element at cursor or the nearest ancestor with the tag name is specified
 */
export function cacheGetNodeAtCursor(
    editor: Editor,
    event: PluginEvent,
    expectedTags?: string | string[]
): HTMLElement {
    let selector = expectedTags instanceof Array ? expectedTags.join(',') : expectedTags;
    return cacheGetEventData(event, 'GET_NODE_AT_CURSOR_' + selector, () =>
        getNodeAtCursor(editor, expectedTags)
    );
}

/**
 * @deprecated Use cacheGetElementAtCursor instead
 */
export function cacheGetListElement(editor: Editor, event?: PluginEvent): Node {
    return cacheGetElementAtCursor(editor, event, 'LI');
}
