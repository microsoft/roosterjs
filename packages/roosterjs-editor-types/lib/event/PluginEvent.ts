import BeforeDisposeEvent from './BeforeDisposeEvent';
import BeforePasteEvent from './BeforePasteEvent';
import ContentChangedEvent from './ContentChangedEvent';
import EditorReadyEvent from './EditorReadyEvent';
import ExtractContentEvent from './ExtractContentEvent';
import PluginDomEvent from './PluginDomEvent';

/**
 * Editor plugin event interface
 */

type PluginEvent =
    | BeforePasteEvent
    | ContentChangedEvent
    | ExtractContentEvent
    | PluginDomEvent
    | EditorReadyEvent
    | BeforeDisposeEvent;

export default PluginEvent;
