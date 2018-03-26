import { PluginEvent } from 'roosterjs-editor-types';

// Clear a specifc cached data (as specified by a key) in a plugin event
function clearEventDataCache(event: PluginEvent, key: string) {
    if (event && event.eventDataCache && event.eventDataCache.hasOwnProperty(key)) {
        delete event.eventDataCache[key];
    }
}

// Return the cached event data per cache key if there is already one.
// If not, create one and put it in event data cache
function cacheGetEventData<T>(event: PluginEvent, key: string, getter: () => T): T {
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

export { cacheGetEventData, clearEventDataCache };
