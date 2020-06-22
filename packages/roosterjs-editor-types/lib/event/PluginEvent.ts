import BeforeDisposeEvent from './BeforeDisposeEvent';
import BeforePasteEvent from './BeforePasteEvent';
import ContentChangedEvent from './ContentChangedEvent';
import DarkModeChangedEvent from './DarkModeChangedEvent';
import EditorReadyEvent from './EditorReadyEvent';
import ExtractContentEvent from './ExtractContentEvent';
import ExtractContentWithDomEvent from './ExtractContentWithDomEvent';
import PendingFormatStateChangedEvent from './PendingFormatStateChangedEvent';
import { PluginDomEvent } from './PluginDomEvent';

/**
 * Editor plugin event interface
 */
export type PluginEvent =
    | BeforePasteEvent
    | ContentChangedEvent
    | ExtractContentEvent
    | ExtractContentWithDomEvent
    | PluginDomEvent
    | EditorReadyEvent
    | BeforeDisposeEvent
    | PendingFormatStateChangedEvent
    | DarkModeChangedEvent;
