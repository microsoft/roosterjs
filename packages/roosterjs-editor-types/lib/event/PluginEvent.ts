import BeforeCutCopyEvent, { CompatibleBeforeCutCopyEvent } from './BeforeCutCopyEvent';
import BeforeDisposeEvent, { CompatibleBeforeDisposeEvent } from './BeforeDisposeEvent';
import BeforeKeyboardEditingEvent, {
    CompatibleBeforeKeyboardEditingEvent,
} from './BeforeKeyboardEditingEvent';
import BeforePasteEvent, { CompatibleBeforePasteEvent } from './BeforePasteEvent';
import BeforeSetContentEvent, { CompatibleBeforeSetContentEvent } from './BeforeSetContentEvent';
import ContentChangedEvent, { CompatibleContentChangedEvent } from './ContentChangedEvent';
import EditImageEvent, { CompatibleEditImageEvent } from './EditImageEvent';
import EditorReadyEvent, { CompatibleEditorReadyEvent } from './EditorReadyEvent';
import EntityOperationEvent, { CompatibleEntityOperationEvent } from './EntityOperationEvent';
import SelectionChangedEvent, { CompatibleSelectionChangedEvent } from './SelectionChangeEvent';
import ZoomChangedEvent, { CompatibleZoomChangedEvent } from './ZoomChangedEvent';
import { CompatiblePluginDomEvent, PluginDomEvent } from './PluginDomEvent';
import {
    CompatibleEnterShadowEditEvent,
    CompatibleLeaveShadowEditEvent,
    EnterShadowEditEvent,
    LeaveShadowEditEvent,
} from './ShadowEditEvent';
import PendingFormatStateChangedEvent, {
    CompatiblePendingFormatStateChangedEvent,
} from './PendingFormatStateChangedEvent';
import ExtractContentWithDomEvent, {
    CompatibleExtractContentWithDomEvent,
} from './ExtractContentWithDomEvent';

/**
 * Editor plugin event interface
 */
export type PluginEvent =
    | BeforeCutCopyEvent
    | BeforePasteEvent
    | ContentChangedEvent
    | EntityOperationEvent
    | ExtractContentWithDomEvent
    | PluginDomEvent
    | EditorReadyEvent
    | BeforeDisposeEvent
    | PendingFormatStateChangedEvent
    | EnterShadowEditEvent
    | LeaveShadowEditEvent
    | EditImageEvent
    | BeforeSetContentEvent
    | ZoomChangedEvent
    | SelectionChangedEvent
    | BeforeKeyboardEditingEvent
    | CompatibleBeforeCutCopyEvent
    | CompatibleBeforeDisposeEvent
    | CompatibleBeforePasteEvent
    | CompatibleBeforeSetContentEvent
    | CompatibleContentChangedEvent
    | CompatibleEditImageEvent
    | CompatibleEditorReadyEvent
    | CompatibleEntityOperationEvent
    | CompatibleExtractContentWithDomEvent
    | CompatiblePendingFormatStateChangedEvent
    | CompatiblePluginDomEvent
    | CompatibleEnterShadowEditEvent
    | CompatibleLeaveShadowEditEvent
    | CompatibleZoomChangedEvent
    | CompatibleSelectionChangedEvent
    | CompatibleBeforeKeyboardEditingEvent;
