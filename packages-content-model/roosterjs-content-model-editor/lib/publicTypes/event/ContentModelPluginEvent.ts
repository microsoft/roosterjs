import BasePluginEvent from './BasePluginEvent';
import { ContentModelBeforeCutCopyEvent } from './ContentModelBeforeCutCopyEvent';
import { ContentModelBeforeDisposeEvent } from './ContentModelBeforeDisposeEvent';
import { ContentModelBeforeKeyboardEditingEvent } from './ContentModelBeforeKeyboardEditingEvent';
import { ContentModelBeforePasteEvent } from './ContentModelBeforePasteEvent';
import { ContentModelBeforeSetContentEvent } from './ContentModelBeforeSetContentEvent';
import { ContentModelContentChangedEvent } from './ContentModelContentChangedEvent';
import { ContentModelEditImageEvent } from './ContentModelEditImageEvent';
import { ContentModelEditorReadyEvent } from './ContentModelEditorReadyEvent';
import { ContentModelEntityOperationEvent } from './ContentModelEntityOperationEvent';
import { ContentModelExtractContentWithDomEvent } from './ContentModelExtractContentWithDomEvent';
import { ContentModelPluginDomEvent } from './ContentModelPluginDomEvent';
import { ContentModelSelectionChangedEvent } from './ContentModelSelectionChangedEvent';
import { ContentModelZoomChangedEvent } from './ContentModelZoomChangedEvent';
import { PluginEventType } from './PluginEventType';
import {
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
    | ContentModelPluginDomEvent
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
    T extends PluginEventType
> = E extends BasePluginEvent<T> ? E : never;

/**
 * A type to get specify plugin event type from eventType parameter.
 */
export type PluginEventFromType<T extends PluginEventType> = PluginEventFromTypeGeneric<
    ContentModelPluginEvent,
    T
>;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 * This type is a middle result and only used by PluginEventData type
 */
export type PluginEventDataGeneric<
    E extends ContentModelPluginEvent,
    T extends PluginEventType
> = E extends BasePluginEvent<T> ? Pick<E, Exclude<keyof E, 'eventType'>> : never;

/**
 * A type to extract data part of a plugin event type. Data part is the plugin event without eventType field.
 */
export type PluginEventData<T extends PluginEventType> = PluginEventDataGeneric<
    ContentModelPluginEvent,
    T
>;
