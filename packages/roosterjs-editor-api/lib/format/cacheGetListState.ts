import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { ListState, PluginEvent } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTSTATE = 'LISTSTATE';

// Get the list state
export default function cacheGetListState(editor: Editor, event?: PluginEvent): ListState {
    return cacheGetEventData<ListState>(event, EVENTDATACACHE_LISTSTATE, () => {
        let itemNodes = queryNodesWithSelection(editor, 'li');
        if (itemNodes.length > 0) {
            let tagName = getTagOfNode(itemNodes[0].parentNode);
            if (tagName == 'OL') {
                return ListState.Numbering;
            } else if (tagName == 'UL') {
                return ListState.Bullets;
            }
        }
        return ListState.None;
    });
}
