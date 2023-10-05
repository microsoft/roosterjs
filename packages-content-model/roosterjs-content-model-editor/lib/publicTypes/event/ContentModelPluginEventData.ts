import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import { ContentModelPluginEvent } from './ContentModelPluginEvent';
import { ContentModelPluginEventType } from './ContentModelPluginEventType';

/**
 * A type to get specify plugin event type from eventType parameter.
 * This type is a middle result and only used by PluginEventFromType type
 */
export type ContentModelPluginEventFromTypeGeneric<
    E extends ContentModelPluginEvent,
    T extends ContentModelPluginEventType
> = E extends ContentModelBasePluginEvent<T> ? E : never;

/**
 * A type to get specify plugin event type from eventType parameter.
 */
export type ContentModelPluginEventFromType<
    T extends ContentModelPluginEventType
> = ContentModelPluginEventFromTypeGeneric<ContentModelPluginEvent, T>;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 * This type is a middle result and only used by PluginEventData type
 */
export type ContentModelPluginEventDataGeneric<
    E extends ContentModelPluginEvent,
    T extends ContentModelPluginEventType
> = E extends ContentModelBasePluginEvent<T> ? Pick<E, Exclude<keyof E, 'eventType'>> : never;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 */
export type ContentModelPluginEventData<
    T extends ContentModelPluginEventType
> = ContentModelPluginEventDataGeneric<ContentModelPluginEvent, T>;
