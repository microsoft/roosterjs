import cacheGetEventData from './cacheGetEventData';
import clearEventDataCache from './clearEventDataCache';
import Editor from '../editor/Editor';
import { PluginEvent } from 'roosterjs-editor-types';
import { PositionContentSearcher } from 'roosterjs-editor-dom';

const CONTENTSEARCHER_KEY = 'CONTENTSEARCHER';

/**
 * Try get existing PositionContentSearcher from an event. If there isn't one, create a new one from editor.
 * @param event The plugin event, it stores the event cached data for looking up.
 * If passed as null, we will create a new PositionContentSearcher
 * @param editor The editor instance
 * @returns The PositionContentSearcher object
 */
export function cacheGetContentSearcher(
    event: PluginEvent,
    editor: Editor
): PositionContentSearcher {
    return cacheGetEventData(event, CONTENTSEARCHER_KEY, () => editor.getContentSearcherOfCursor());
}

/**
 * Clear the PositionContentSearcher in a plugin event.
 * This is called when the content is changed
 * @param event The plugin event
 */
export function clearContentSearcherCache(event: PluginEvent) {
    clearEventDataCache(event, CONTENTSEARCHER_KEY);
}
