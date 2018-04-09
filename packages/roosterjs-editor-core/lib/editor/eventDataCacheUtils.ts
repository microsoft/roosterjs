import { PluginEvent } from 'roosterjs-editor-types';

/**
 * Clear a cached object by its key from an event object
 * @param event The event object
 * @param key The cache key
 */
export function clearEventDataCache(event: PluginEvent, key: string) {
    if (event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)) {
        delete event.eventDataCache[key];
    }
}

/**
 * Gets the cached event data by cache key from event object if there is already one.
 * Otherwise, call getter function to create one, and cache it.
 * @param event The event object
 * @param key Cache key string, need to be unique
 * @param getter Getter function to get the object when it is not in cache yet
 */
export function cacheGetEventData<T>(event: PluginEvent, key: string, getter: () => T): T {
    let result =
        event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)
            ? <T>event.eventDataCache[key]
            : getter();
    if (event) {
        event.eventDataCache = event.eventDataCache || {};
        event.eventDataCache[key] = result;
    }

    return result;
}
