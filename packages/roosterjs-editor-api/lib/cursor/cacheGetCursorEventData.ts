import CursorData from './CursorData';
import { Editor, cacheGetEventData, clearEventDataCache } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';

const EVENTDATACACHE_CURSORDATA = 'CURSORDATA';

/**
 * Read CursorData from plugin event cache. If not, create one
 * @param event The plugin event
 * @param editor The editor instance
 * @returns The cursor data
 */
export default function cacheGetCursorEventData(event: PluginEvent, editor: Editor): CursorData {
    return cacheGetEventData<CursorData>(event, EVENTDATACACHE_CURSORDATA, (): CursorData => {
        return new CursorData(editor);
    });
}

/**
 * Clear the cursor data in a plugin event.
 * This is called when the cursor data is changed, e.g, the text is replace with HyperLink
 * @param event The plugin event
 */
export function clearCursorEventDataCache(event: PluginEvent) {
    clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
