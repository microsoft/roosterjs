import { PluginEvent } from 'roosterjs-editor-types';

/**
 * Clear a cached object by its key from an event object
 * @param event The event object
 * @param key The cache key
 */
export default function clearEventDataCache(event: PluginEvent, key: string): void {
    if (event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)) {
        delete event.eventDataCache[key];
    }
}
