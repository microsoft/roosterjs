import BasePluginEvent from './BasePluginEvent';
import PluginEventType from './PluginEventType';

/**
 * This represents a PluginEvent wrapping native browser event
 */
interface GenericPluginDomEvent extends BasePluginEvent {
    eventType:
        PluginEventType.CompositionEnd |
        PluginEventType.MouseDown |
        PluginEventType.MouseUp |
        PluginEventType.Idle,

    /**
     * original DOM event
     */
    rawEvent: Event;
}

export default GenericPluginDomEvent;
