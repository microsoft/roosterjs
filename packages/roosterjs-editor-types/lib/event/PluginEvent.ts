import BasePluginEvent from './BasePluginEvent';
import BeforeDisposeEvent from './BeforeDisposeEvent';
import BeforePasteEvent from './BeforePasteEvent';
import ContentChangedEvent from './ContentChangedEvent';
import EditorReadyEvent from './EditorReadyEvent';
import ExtractContentEvent from './ExtractContentEvent';
import KeyboardDomEvent from './KeyboardDomEvent';
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
  | BeforeDisposeEvent
  | KeyboardDomEvent;

export default PluginEvent;
