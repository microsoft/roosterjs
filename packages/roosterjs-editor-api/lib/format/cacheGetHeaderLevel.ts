import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';

const EVENTDATACACHE_HEADER_LEVEL = 'HeaderLevel';

/**
 * Get the header level in current selection. The header level refers to the HTML <H1> to <H6> elements,
 * level 1 indicates <H1>, level 2 indicates <H2>, etc
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the node within selection
 * @returns The header level, 0 if there is no HTML heading elements
 */
export default function cacheGetHeaderLevel(editor: Editor, event?: PluginEvent): number {
    return cacheGetEventData<number>(event, EVENTDATACACHE_HEADER_LEVEL, () => {
        for (let i = 1; i <= 6; i++) {
            if (queryNodesWithSelection(editor, 'H' + i).length > 0) {
                return i;
            }
        }
        return 0;
    });
}
