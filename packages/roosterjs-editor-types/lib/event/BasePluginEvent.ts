import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Editor plugin event interface
 */
export default interface BasePluginEvent<T extends PluginEventType | CompatiblePluginEventType> {
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
