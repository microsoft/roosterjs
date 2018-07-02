import PluginDomEvent from './PluginDomEvent';
import PluginEventType from './PluginEventType';
import BasePluginEvent from './BasePluginEvent';

/**
 * This represents a PluginEvent wrapping native browser event
 */
interface KeyboardDomEvent extends BasePluginEvent {
    eventType:
        PluginEventType.KeyDown |
        PluginEventType.KeyPress |
        PluginEventType.KeyUp;

    /**
     * original DOM event
     */
    rawEvent: KeyboardEvent;
}

export default KeyboardDomEvent;
