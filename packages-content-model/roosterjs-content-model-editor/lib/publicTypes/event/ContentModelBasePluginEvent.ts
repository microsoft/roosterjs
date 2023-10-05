import type { ContentModelPluginEventType } from './ContentModelPluginEventType';

/**
 * Editor plugin event interface
 */
export interface ContentModelBasePluginEvent<T extends ContentModelPluginEventType> {
    /**
     * Type of this event
     */
    eventType: T;

    /**
     * An optional event cache.
     * This will be consumed by event cache API to store some expensive calculation result.
     * So that for the same event across plugins, the result doesn't need to be calculated again
     */
    eventDataCache?: { [key: string]: any };
}
