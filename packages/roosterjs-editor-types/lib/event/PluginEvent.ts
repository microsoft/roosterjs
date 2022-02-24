import BeforeCutCopyEvent from './BeforeCutCopyEvent';
import BeforeDisposeEvent from './BeforeDisposeEvent';
import BeforePasteEvent from './BeforePasteEvent';
import BeforeSetContentEvent from './BeforeSetContentEvent';
import ColorChangedEvent from './ColorChangedEvent';
import ContentChangedEvent from './ContentChangedEvent';
import EditImageEvent from './EditImageEvent';
import EditorReadyEvent from './EditorReadyEvent';
import EntityOperationEvent from './EntityOperationEvent';
import ExtractContentWithDomEvent from './ExtractContentWithDomEvent';
import PendingFormatStateChangedEvent from './PendingFormatStateChangedEvent';
import ZoomChangedEvent from './ZoomChangedEvent';
import { EnterShadowEditEvent, LeaveShadowEditEvent } from './ShadowEditEvent';
import { PluginDomEvent } from './PluginDomEvent';

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
    | ColorChangedEvent;
