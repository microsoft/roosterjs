import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTELEMENT = 'LISTELEMENT';
export type ListType = 'LI' | 'BLOCKQUOTE';

export default function cacheGetListElement(editor: Editor, event?: PluginEvent, listType?: ListType): Element {
    return cacheGetEventData<Element>(event, EVENTDATACACHE_LISTELEMENT, () => {
        let node = getNodeAtCursor(editor);
        listType = listType || 'LI';
        return getListElementAtNode(editor, node, listType);
    });
}

export function getListElementAtNode(editor: Editor, node: Node, listType: ListType): Element {
    let startElement =
        node && node.nodeType == NodeType.Text ? node.parentElement : <Element>node;
    while (startElement && editor.contains(startElement)) {
        let tagName = getTagOfNode(startElement);
        if (tagName == listType) {
            return startElement;
        }
        startElement = startElement.parentElement;
    }

    return null;
}