import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { NodeType, PluginEvent } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

/**
 * Get the node at selection. If an expectedTag is specified, return the nearest ancestor of current node
 * which matches the tag name, or null if no match found in editor.
 * @param editor The editor instance
 * @param expectedTag The expected tag name. If null, return the element at cursor
 * @param startNode If specified, use this node as start node to search instead of current node
 * @returns The node at cursor or the nearest ancestor with the tag name is specified
 */
export default function getNodeAtCursor(
    editor: Editor,
    expectedTag?: string,
    startNode?: Node
): Node {
    let node = startNode;
    if (!node && editor.hasFocus()) {
        let selection = editor.getSelection();
        node = selection ? selection.focusNode : null;
    }

    if (!node) {
        let selectionRange = editor.getSelectionRange();
        node = selectionRange.collapsed
            ? selectionRange.start.node
            : selectionRange.rawRange.commonAncestorContainer;
    }

    node = node && node.nodeType == NodeType.Text ? node.parentNode : node;
    if (expectedTag) {
        while (editor.contains(node)) {
            if (getTagOfNode(node) == expectedTag.toUpperCase()) {
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
 * @param expectedTag The expected tag name. If null, return the element at cursor
 * @returns The element at cursor or the nearest ancestor with the tag name is specified
 */
export function cacheGetNodeAtCursor(
    editor: Editor,
    event: PluginEvent,
    expectedTag: string
): Node {
    return cacheGetEventData(event, 'GET_NODE_AT_CURSOR_' + expectedTag, () =>
        getNodeAtCursor(editor, expectedTag)
    );
}

/**
 * @deprecated Use cacheGetNodeAtCursor instead
 */
export function cacheGetListElement(editor: Editor, event?: PluginEvent): Node {
    return cacheGetNodeAtCursor(editor, event, 'LI');
}
