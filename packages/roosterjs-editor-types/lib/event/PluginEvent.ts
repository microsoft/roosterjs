import BeforeCutCopyEvent from './BeforeCutCopyEvent';
import BeforeDisposeEvent from './BeforeDisposeEvent';
import BeforePasteEvent from './BeforePasteEvent';
import ContentChangedEvent from './ContentChangedEvent';
import DarkModeChangedEvent from './DarkModeChangedEvent';
import EditorReadyEvent from './EditorReadyEvent';
import EntityOperationEvent from './EntityOperationEvent';
import ExtractContentWithDomEvent from './ExtractContentWithDomEvent';
import PendingFormatStateChangedEvent from './PendingFormatStateChangedEvent';
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
    | DarkModeChangedEvent;
