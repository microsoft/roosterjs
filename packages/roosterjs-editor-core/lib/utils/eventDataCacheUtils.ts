import { PluginEvent } from 'roosterjs-editor-types';

// cache some certain data in event cache by key
function cacheEventData<T>(event: PluginEvent, cacheKey: string, eventData: T): void {
    if (event) {
        if (!event.eventDataCache) {
            event.eventDataCache = {};
        }
        event.eventDataCache[cacheKey] = eventData;
    }
}

// Get cached event data (as specified by key) or null if not found
function getEventDataCache<T>(event: PluginEvent, key: string): T {
    let eventData: T = null;
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        eventData = event.eventDataCache[key] as T;
    }
    return eventData;
}

// Clear a specifc cached data (as specified by a key) in a plugin event
function clearEventDataCache(event: PluginEvent, key: string): void {
    if (event && event.eventDataCache && event.eventDataCache[key]) {
        event.eventDataCache[key] = null;
    }
}

// Return the cached event data per cache key if there is already one.
// If not, create one and put it in event data cache
function cacheGetEventData<T>(event: PluginEvent, cacheKey: string, eventDataBuilder: () => T): T {
    let eventData = getEventDataCache<T>(event, cacheKey);
    if (!eventData) {
        eventData = eventDataBuilder();
        cacheEventData<T>(event, cacheKey, eventData);
    }
    return eventData;
}

export { cacheEventData, getEventDataCache, clearEventDataCache, cacheGetEventData };
