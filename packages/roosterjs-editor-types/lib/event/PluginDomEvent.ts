import BasePluginEvent from './BasePluginEvent';
import PluginEventType from './PluginEventType';

export interface PluginCompositionEvent extends BasePluginEvent {
    eventType: PluginEventType.CompositionEnd;
    rawEvent: CompositionEvent;
}

export interface PluginMouseEvent extends BasePluginEvent {
    eventType: PluginEventType.MouseDown | PluginEventType.MouseUp;
    rawEvent: MouseEvent;
}

export interface PluginKeyboardEvent extends BasePluginEvent {
    eventType: PluginEventType.KeyDown | PluginEventType.KeyPress | PluginEventType.KeyUp;
    rawEvent: KeyboardEvent;
}

/**
 * This represents a PluginEvent wrapping native browser event
 */
type PluginDomEvent = PluginCompositionEvent | PluginMouseEvent | PluginKeyboardEvent;

export default PluginDomEvent;
