import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { ListState, PluginEvent } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_LISTSTATE = 'LISTSTATE';

/**
 * @deprecated use getNodeAtCursor(editor, ['OL','UL']) instead
 * Get the list state at selection
 * The list state refers to the HTML elements <OL> or <UL>
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the first <LI> node in selection and return the list state of its direct parent
 * @returns The list state. ListState.Numbering indicates <OL>, ListState.Bullets indicates <UL>,
 * ListState.None indicates no <OL> or <UL> elements found at current selection
 */
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
