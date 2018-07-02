import BasePluginEvent from './BasePluginEvent';
import PluginEventType from './PluginEventType';

/**
 * This represents a PluginEvent wrapping native browser event
 */
interface PluginDomEvent extends BasePluginEvent {
    eventType:
        PluginEventType.CompositionEnd |
        PluginEventType.MouseDown |
        PluginEventType.MouseUp |
        PluginEventType.KeyDown |
        PluginEventType.KeyPress |
        PluginEventType.KeyUp |
        PluginEventType.Idle,

    /**
     * original DOM event
     */
    rawEvent: Event;
}

export default PluginDomEvent;
