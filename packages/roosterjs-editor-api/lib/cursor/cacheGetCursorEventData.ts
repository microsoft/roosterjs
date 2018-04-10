import { Editor, cacheGetEventData, clearEventDataCache } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';
import { TextBeforePositionTraverser } from 'roosterjs-editor-dom';

const EVENTDATACACHE_CURSORDATA = 'CURSORDATA';

/**
 * Read CursorData from plugin event cache. If not, create one
 * @param event The plugin event, it stores the event cached data for looking up.
 * If passed as null, we will create a new cursor data
 * @param editor The editor instance
 * @returns The cursor data
 */
export default function cacheGetCursorEventData(
    event: PluginEvent,
    editor: Editor
): TextBeforePositionTraverser {
    return cacheGetEventData(event, EVENTDATACACHE_CURSORDATA, () =>
        editor.getTextBeforePositionTraverser()
    );
}

/**
 * Clear the cursor data in a plugin event.
 * This is called when the cursor data is changed, e.g, the text is replace with HyperLink
 * @param event The plugin event
 */
export function clearCursorEventDataCache(event: PluginEvent) {
    clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
