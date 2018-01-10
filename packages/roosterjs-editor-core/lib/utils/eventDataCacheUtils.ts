import { PluginEvent } from 'roosterjs-editor-types';

/**
 * cache some certain data in event cache by key
 * @param event The plugin event
 * @param cacheKey The cache key
 * @param eventData The event data
 */
function cacheEventData<T>(event: PluginEvent, cacheKey: string, eventData: T) {
    if (event) {
        if (!event.eventDataCache) {
            event.eventDataCache = {};
        }
        event.eventDataCache[cacheKey] = eventData;
    }
}

/**
 * Get cached event data (as specified by key) or null if not found
 * @param event The plugin event
 * @param key The cache key
 * @returns The cached event data
 */
function getEventDataCache<T>(event: PluginEvent, key: string): T {
    let eventData: T = null;
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        eventData = event.eventDataCache[key] as T;
    }
    return eventData;
}

/**
 * Clear a specifc cached data (as specified by a key) in a plugin event
 * @param event The plugin event
 * @param key The cache key
 */
function clearEventDataCache(event: PluginEvent, key: string) {
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        event.eventDataCache[key] = null;
    }
}

/**
 * Returns the cached event data per cache key if there is already one.
 * If not, create one and put it in event data cache
 * @param event The plugin event
 * @param cacheKey The cache key
 * @param eventDataBuilder The callback function to build event data
 * @returns The event data
 */
function cacheGetEventData<T>(event: PluginEvent, cacheKey: string, eventDataBuilder: () => T): T {
    let eventData = getEventDataCache<T>(event, cacheKey);
    if (!eventData) {
        eventData = eventDataBuilder();
        cacheEventData<T>(event, cacheKey, eventData);
    }
    return eventData;
}

export { cacheEventData, getEventDataCache, clearEventDataCache, cacheGetEventData };
