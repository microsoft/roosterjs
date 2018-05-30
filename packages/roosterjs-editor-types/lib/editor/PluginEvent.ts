import PluginEventType from './PluginEventType';

/**
 * Editor plugin event interface
 */
interface PluginEvent {
    /**
     * Type of this event
     */
    eventType: PluginEventType;

    /**
     * An optional event cache.
     * This will be consumed by event cache API to store some expensive calculation result.
     * So that for the same event across plugins, the result doesn't need to be calculated again
     */
    eventDataCache?: { [key: string]: any };
}

export default PluginEvent;
