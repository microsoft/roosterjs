import PluginEvent from './PluginEvent';

/**
 * This represents a PluginEvent for a DOM event
 */
interface PluginDomEvent extends PluginEvent {
    /**
     * original DOM event
     */
    rawEvent: Event;
}

export default PluginDomEvent;
