import cacheGetListElement from './cacheGetListElement';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { ListState, PluginEvent, NodeType, ContentScope } from 'roosterjs-editor-types';
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

        // In rare cases that an element is both in list and blockquote we treat is as a list element
        if (tagName == 'BLOCKQUOTE') {
            listState = ListState.BlockQuote;
            break;
        }

        startNode = startNode.parentNode;
    }

    return listState;
}

// Get the list state from selection
export function getListStateAtSelection(editor: Editor, nodeAtCursor: Node): ListState {
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let range = editor.getSelectionRange();

    if (contentTraverser && range && !range.collapsed) {
        let blockElement = contentTraverser.currentBlockElement;
        let listStates = [];

        // If any lines in selection is related to blockquote, then the state is blockquote,
        // this is treated different than other list states
        while (blockElement) {
            let listState = getListStateAtNode(editor, blockElement.getStartNode());
            if (listState == ListState.BlockQuote) {
                return ListState.BlockQuote;
            } else if (listStates.indexOf(listState) == -1) {
                listStates.push(listState);
            }
            blockElement = contentTraverser.getNextBlockElement();
        }

        return listStates.length > 1 ? ListState.None : listStates[0];
    } else {
        return getListStateAtNode(editor, nodeAtCursor);
    }
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
