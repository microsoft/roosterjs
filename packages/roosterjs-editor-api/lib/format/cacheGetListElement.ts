import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTELEMENT = 'LISTELEMENT';

/**
 * Get the list element at current selection
 * @param editor The editor instance
 * @param event (Optional) The plugin event
 * @returns The list element
 */
export default function cacheGetListElement(editor: Editor, event?: PluginEvent): Element {
    return cacheGetEventData<Element>(event, EVENTDATACACHE_LISTELEMENT, () => {
        let node = getNodeAtCursor(editor);
        return getListElementAtNode(editor, node, 'LI');
    });
}

/**
 * Get the list element at node
 * @param editor The editor instance
 * @param node The node
 * @param tagName The tag name of the list element we want to get. e.g, 'LI', 'OL', etc
 * @returns The list element at node, null if no list element at node
 */
export function getListElementAtNode(editor: Editor, node: Node, tagName: string): Element {
    let startElement = node && node.nodeType == NodeType.Text ? node.parentElement : <Element>node;
    while (startElement && editor.contains(startElement)) {
        if (getTagOfNode(startElement) == tagName) {
            return startElement;
        }
        startElement = startElement.parentElement;
    }

    return null;
}
