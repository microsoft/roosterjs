import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { ListState, PluginEvent } from 'roosterjs-editor-types';
import { getTagOfNode } from 'roosterjs-editor-dom';

const EVENTDATACACHE_HEADER_LEVEL = 'HeaderLevel';

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