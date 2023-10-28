import type { BasePluginEvent } from './BasePluginEvent';
import type { BeforeCutCopyEvent } from './BeforeCutCopyEvent';
import type { BeforeDisposeEvent } from './BeforeDisposeEvent';
import type { BeforeKeyboardEditingEvent } from './BeforeKeyboardEditingEvent';
import type { BeforePasteEvent } from './BeforePasteEvent';
import type { ContentChangedEvent } from './ContentChangedEvent';
import type { EditImageEvent } from './EditImageEvent';
import type { EditorReadyEvent } from './EditorReadyEvent';
import type { EntityOperationEvent } from './EntityOperationEvent';
import type { ExtractContentWithDomEvent } from './ExtractContentWithDomEvent';
import type { PluginEventType } from './PluginEventType';
import type { SelectionChangedEvent } from './SelectionChangedEvent';
import type {
    PluginCompositionEvent,
    PluginContextMenuEvent,
    PluginInputEvent,
    PluginKeyDownEvent,
    PluginKeyUpEvent,
    PluginMouseDownEvent,
    PluginMouseUpEvent,
    PluginScrollEvent,
} from './PluginDomEvent';
import type { EnteredShadowEditEvent, LeavingShadowEditEvent } from './ShadowEditEvent';

/**
 * Editor plugin event interface
 */
export type PluginEvent =
    | BeforeCutCopyEvent
    | BeforePasteEvent
    | ContentChangedEvent
    | EntityOperationEvent
    | ExtractContentWithDomEvent
    | PluginMouseDownEvent
    | PluginMouseUpEvent
    | PluginContextMenuEvent
    | PluginScrollEvent
    | PluginKeyDownEvent
    | PluginKeyUpEvent
    | PluginInputEvent
    | PluginCompositionEvent
    | EditorReadyEvent
    | BeforeDisposeEvent
    | EnteredShadowEditEvent
    | LeavingShadowEditEvent
    | EditImageEvent
    | SelectionChangedEvent
    | BeforeKeyboardEditingEvent;

/**
 * A type to get specify plugin event type from eventType parameter.
 * This type is a middle result and only used by PluginEventFromType type
 */
export type PluginEventFromTypeGeneric<
    E extends PluginEvent,
    T extends PluginEventType
> = E extends BasePluginEvent<T> ? E : never;

/**
 * A type to get specify plugin event type from eventType parameter.
 */
export type PluginEventFromType<T extends PluginEventType> = PluginEventFromTypeGeneric<
    PluginEvent,
    T
>;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 * This type is a middle result and only used by PluginEventData type
 */
export type PluginEventDataGeneric<
    E extends PluginEvent,
    T extends PluginEventType
> = E extends BasePluginEvent<T> ? Pick<E, Exclude<keyof E, 'eventType'>> : never;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 */
export type PluginEventData<T extends PluginEventType> = PluginEventDataGeneric<PluginEvent, T>;
