import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import type { ContentModelBeforeCutCopyEvent } from './ContentModelBeforeCutCopyEvent';
import type { ContentModelBeforeDisposeEvent } from './ContentModelBeforeDisposeEvent';
import type { ContentModelBeforeKeyboardEditingEvent } from './ContentModelBeforeKeyboardEditingEvent';
import type { ContentModelBeforePasteEvent } from './ContentModelBeforePasteEvent';
import type { ContentModelBeforeSetContentEvent } from './ContentModelBeforeSetContentEvent';
import type { ContentModelContentChangedEvent } from './ContentModelContentChangedEvent';
import type { ContentModelEditImageEvent } from './ContentModelEditImageEvent';
import type { ContentModelEditorReadyEvent } from './ContentModelEditorReadyEvent';
import type { ContentModelEntityOperationEvent } from './ContentModelEntityOperationEvent';
import type { ContentModelExtractContentWithDomEvent } from './ContentModelExtractContentWithDomEvent';
import type { ContentModelPluginEventType } from './ContentModelPluginEventType';
import type { ContentModelSelectionChangedEvent } from './ContentModelSelectionChangedEvent';
import type { ContentModelZoomChangedEvent } from './ContentModelZoomChangedEvent';
import type {
    ContentModelPluginCompositionEvent,
    ContentModelPluginContextMenuEvent,
    ContentModelPluginInputEvent,
    ContentModelPluginKeyDownEvent,
    ContentModelPluginKeyUpEvent,
    ContentModelPluginMouseDownEvent,
    ContentModelPluginMouseUpEvent,
    ContentModelPluginScrollEvent,
} from './ContentModelPluginDomEvent';
import type {
    ContentModelEnteredShadowEditEvent,
    ContentModelLeavingShadowEditEvent,
} from './ContentModelShadowEditEvent';

/**
 * Editor plugin event interface
 */
export type ContentModelPluginEvent =
    | ContentModelBeforeCutCopyEvent
    | ContentModelBeforePasteEvent
    | ContentModelContentChangedEvent
    | ContentModelEntityOperationEvent
    | ContentModelExtractContentWithDomEvent
    | ContentModelPluginMouseDownEvent
    | ContentModelPluginMouseUpEvent
    | ContentModelPluginContextMenuEvent
    | ContentModelPluginScrollEvent
    | ContentModelPluginKeyDownEvent
    | ContentModelPluginKeyUpEvent
    | ContentModelPluginInputEvent
    | ContentModelPluginCompositionEvent
    | ContentModelEditorReadyEvent
    | ContentModelBeforeDisposeEvent
    | ContentModelEnteredShadowEditEvent
    | ContentModelLeavingShadowEditEvent
    | ContentModelEditImageEvent
    | ContentModelBeforeSetContentEvent
    | ContentModelZoomChangedEvent
    | ContentModelSelectionChangedEvent
    | ContentModelBeforeKeyboardEditingEvent;

/**
 * A type to get specify plugin event type from eventType parameter.
 * This type is a middle result and only used by PluginEventFromType type
 */
export type PluginEventFromTypeGeneric<
    E extends ContentModelPluginEvent,
    T extends ContentModelPluginEventType
> = E extends ContentModelBasePluginEvent<T> ? E : never;

/**
 * A type to get specify plugin event type from eventType parameter.
 */
export type PluginEventFromType<T extends ContentModelPluginEventType> = PluginEventFromTypeGeneric<
    ContentModelPluginEvent,
    T
>;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 * This type is a middle result and only used by PluginEventData type
 */
export type PluginEventDataGeneric<
    E extends ContentModelPluginEvent,
    T extends ContentModelPluginEventType
> = E extends ContentModelBasePluginEvent<T> ? Pick<E, Exclude<keyof E, 'eventType'>> : never;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 */
export type PluginEventData<T extends ContentModelPluginEventType> = PluginEventDataGeneric<
    ContentModelPluginEvent,
    T
>;
