import { PluginEventType } from './PluginEventType';

/**
 * Editor plugin event interface
 */
export interface BasePluginEvent<TPluginEventType extends PluginEventType> {
    /**
     * Type of this event
     */
    eventType: TPluginEventType;

    /**
     * An optional event cache.
     * This will be consumed by event cache API to store some expensive calculation result.
     * So that for the same event across plugins, the result doesn't need to be calculated again
     */
    eventDataCache?: { [key: string]: any };
}
