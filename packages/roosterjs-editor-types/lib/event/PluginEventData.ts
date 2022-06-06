import BasePluginEvent from './BasePluginEvent';
import { PluginEvent } from './PluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * A type to get specify plugin event type from eventType parameter.
 * This type is a middle result and only used by PluginEventFromType type
 */
export type PluginEventFromTypeGeneric<
    E extends PluginEvent,
    T extends PluginEventType | CompatiblePluginEventType
> = E extends BasePluginEvent<T> ? E : never;

/**
 * A type to get specify plugin event type from eventType parameter.
 */
export type PluginEventFromType<
    T extends PluginEventType | CompatiblePluginEventType
> = PluginEventFromTypeGeneric<PluginEvent, T>;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 * This type is a middle result and only used by PluginEventData type
 */
export type PluginEventDataGeneric<
    E extends PluginEvent,
    T extends PluginEventType | CompatiblePluginEventType
> = E extends BasePluginEvent<T> ? Pick<E, Exclude<keyof E, 'eventType'>> : never;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 */
export type PluginEventData<
    T extends PluginEventType | CompatiblePluginEventType
> = PluginEventDataGeneric<PluginEvent, T>;
