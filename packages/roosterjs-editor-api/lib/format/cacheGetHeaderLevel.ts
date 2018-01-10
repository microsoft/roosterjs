import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';

const EVENTDATACACHE_HEADER_LEVEL = 'HeaderLevel';

/**
 * Get the header level in current selection
 * @param editor The editor instance
 * @param event (Optional) The plugin event
 * @returns The header level, 0 if there is no header
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
