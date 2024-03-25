import type { PluginEvent } from 'roosterjs-content-model-types';

/**
 * Gets the cached event data by cache key from event object if there is already one.
 * Otherwise, call getter function to create one, and cache it.
 * @param event The event object
 * @param key Cache key string, need to be unique
 * @param getter Getter function to get the object when it is not in cache yet
 */
export function cacheGetEventData<T, E extends PluginEvent>(
    event: E,
    key: string,
    getter: (event: E) => T
): T {
    const result =
        event.eventDataCache && event.eventDataCache.hasOwnProperty(key)
            ? <T>event.eventDataCache[key]
            : getter(event);
    event.eventDataCache = event.eventDataCache || {};
    event.eventDataCache[key] = result;

    return result;
}
