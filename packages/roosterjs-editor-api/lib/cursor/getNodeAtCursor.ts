import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';
import { getElementOrParentElement, getTagOfNode } from 'roosterjs-editor-dom';

/**
 * Get the node at selection. If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param expectedTags The expected tags name. If null, return the element at cursor
 * @param startNode If specified, use this node as start node to search instead of current node
 * @returns The node at cursor or the nearest ancestor with the tag name is specified
 */
export default function getNodeAtCursor(
    editor: Editor,
    expectedTags?: string | string[],
    startNode?: Node
): Node {
    let node: Node =
        getElementOrParentElement(startNode) ||
        editor.getSelectionRange().start.normalize().element;

    if (expectedTags) {
        if (expectedTags instanceof Array) {
            expectedTags = expectedTags.map(tag => (tag || '').toUpperCase());
        } else {
            expectedTags = [expectedTags.toUpperCase()];
        }
        while (editor.contains(node)) {
            let tag = getTagOfNode(node);
            if (tag && expectedTags.indexOf(tag) >= 0) {
                return node;
            }
            node = node.parentNode;
        }
    }
    return editor.contains(node) ? node : null;
}

/**
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
    expectedTags: string | string[]
): Node {
    let tagNames = expectedTags instanceof Array ? expectedTags.join() : expectedTags;
    return cacheGetEventData(event, 'GET_NODE_AT_CURSOR_' + tagNames, () =>
        getNodeAtCursor(editor, expectedTags)
    );
}
