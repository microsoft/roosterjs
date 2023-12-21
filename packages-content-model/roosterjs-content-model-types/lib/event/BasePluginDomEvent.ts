import type { BasePluginEvent } from './BasePluginEvent';
import type { PluginEventType } from './PluginEventType';

/**
 * Editor plugin event interface
 */
export interface BasePluginDomEvent<
    TPluginEventType extends PluginEventType,
    TRawEvent extends Event
> extends BasePluginEvent<TPluginEventType> {
    /**
     * Raw DOM event
     */
    rawEvent: TRawEvent;
}
