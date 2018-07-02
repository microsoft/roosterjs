import GenericPluginDomEvent from './GenericPluginDomEvent';
import KeyboardDomEvent from './KeyboardDomEvent';

/**
 * This represents a PluginEvent wrapping native browser event
 */
type PluginDomEvent = KeyboardDomEvent | GenericPluginDomEvent;

export default PluginDomEvent;
