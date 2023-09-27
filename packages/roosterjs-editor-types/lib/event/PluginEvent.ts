import type { CompatibleBeforeCutCopyEvent } from './BeforeCutCopyEvent';
import type BeforeCutCopyEvent from './BeforeCutCopyEvent';
import type { CompatibleBeforeDisposeEvent } from './BeforeDisposeEvent';
import type BeforeDisposeEvent from './BeforeDisposeEvent';
import type { CompatibleBeforeKeyboardEditingEvent } from './BeforeKeyboardEditingEvent';
import type BeforeKeyboardEditingEvent from './BeforeKeyboardEditingEvent';
import type { CompatibleBeforePasteEvent } from './BeforePasteEvent';
import type BeforePasteEvent from './BeforePasteEvent';
import type { CompatibleBeforeSetContentEvent } from './BeforeSetContentEvent';
import type BeforeSetContentEvent from './BeforeSetContentEvent';
import type { CompatibleContentChangedEvent } from './ContentChangedEvent';
import type ContentChangedEvent from './ContentChangedEvent';
import type { CompatibleEditImageEvent } from './EditImageEvent';
import type EditImageEvent from './EditImageEvent';
import type { CompatibleEditorReadyEvent } from './EditorReadyEvent';
import type EditorReadyEvent from './EditorReadyEvent';
import type { CompatibleEntityOperationEvent } from './EntityOperationEvent';
import type EntityOperationEvent from './EntityOperationEvent';
import type { CompatibleSelectionChangedEvent } from './SelectionChangeEvent';
import type SelectionChangedEvent from './SelectionChangeEvent';
import type { CompatibleZoomChangedEvent } from './ZoomChangedEvent';
import type ZoomChangedEvent from './ZoomChangedEvent';
import type { CompatiblePluginDomEvent, PluginDomEvent } from './PluginDomEvent';
import type {
    CompatibleEnterShadowEditEvent,
    CompatibleLeaveShadowEditEvent,
    EnterShadowEditEvent,
    LeaveShadowEditEvent,
} from './ShadowEditEvent';
import type { CompatiblePendingFormatStateChangedEvent } from './PendingFormatStateChangedEvent';
import type PendingFormatStateChangedEvent from './PendingFormatStateChangedEvent';
import type { CompatibleExtractContentWithDomEvent } from './ExtractContentWithDomEvent';
import type ExtractContentWithDomEvent from './ExtractContentWithDomEvent';

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
