import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTELEMENT = 'LISTELEMENT';

/**
 * Get the list element at current selection
 * A list element referes to the HTML <LI> element
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will crawl up the node at cursor until we find a list element
 * @returns The list element, or null if no list element at current selection
 */
export default function cacheGetListElement(editor: Editor, event?: PluginEvent): Element {
    return cacheGetEventData<Element>(event, EVENTDATACACHE_LISTELEMENT, () => {
        let node = getNodeAtCursor(editor);
        return getListElementAtNode(editor, node, 'LI');
    });
}

/**
 * Get the list element at node
 * A list element referes to the HTML <LI> element
 * @param editor The editor instance
 * @param node The node
 * @param tagName The tag name of the list element we want to get. e.g, 'LI'
 * @returns The list element at node, or null if no list element at node
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
