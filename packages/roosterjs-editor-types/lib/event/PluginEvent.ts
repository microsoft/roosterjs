import BasePluginEvent from "./BasePluginEvent";
import BeforePasteEvent from "./BeforePasteEvent";
import ContentChangedEvent from "./ContentChangedEvent";
import ExtractContentEvent from "./ExtractContentEvent";
import PluginDomEvent from "./PluginDomEvent";
import EditorReadyEvent from "./EditorReadyEvent";
import BeforeDisposeEvent from "./BeforeDisposeEvent";
import KeyboardDomEvent from "./KeyboardDomEvent";

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
