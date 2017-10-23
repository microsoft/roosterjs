import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTELEMENT = 'LISTELEMENT';

export default function cacheGetListElement(editor: Editor, event?: PluginEvent): Element {
    return cacheGetEventData<Element>(event, EVENTDATACACHE_LISTELEMENT, () => {
        let node = getNodeAtCursor(editor);
        return getListElementAtNode(editor, node, 'LI');
    });
}

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
