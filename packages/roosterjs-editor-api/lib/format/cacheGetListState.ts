import cacheGetListElement from './cacheGetListElement';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { ListState, PluginEvent, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTSTATE = 'LISTSTATE';

// Crawl up the DOM tree from given start node to find if it falls on a list and return the type of list
export function getListStateAtNode(editor: Editor, node: Node): ListState {
    let listState = ListState.None;
    let inList = false;
    let startNode = node && node.nodeType == NodeType.Text ? node.parentNode : node;
    while (startNode && editor.contains(startNode)) {
        let tagName = getTagOfNode(startNode);
        if (inList) {
            if (tagName == 'OL') {
                listState = ListState.Numbering;
                break;
            } else if (tagName == 'UL') {
                listState = ListState.Bullets;
                break;
            }
        } else {
            inList = tagName == 'LI';
        }

        startNode = startNode.parentNode;
    }

    return listState;
}

// Get the list state
export default function cacheGetListState(editor: Editor, event?: PluginEvent): ListState {
    return cacheGetEventData<ListState>(event, EVENTDATACACHE_LISTSTATE, () => {
        let listState = ListState.None;
        let listElement = cacheGetListElement(editor, event);
        if (listElement) {
            listState = getListStateAtNode(editor, listElement);
        }
        return listState;
    });
}
