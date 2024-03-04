import type { BasePluginDomEvent } from './BasePluginEvent';

/**
 * This interface represents a PluginEvent wrapping native KeyDown event
 */
export interface KeyDownEvent extends BasePluginDomEvent<'keyDown', KeyboardEvent> {
    /**
     * Whether this event is handled by edit feature
     */
    handledByEditFeature?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native KeyPress event
 */
export interface KeyPressEvent extends BasePluginDomEvent<'keyPress', KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native KeyUp event
 */
export interface KeyUpEvent extends BasePluginDomEvent<'keyUp', KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native CompositionEnd event
 */
export interface CompositionEndEvent
    extends BasePluginDomEvent<'compositionEnd', CompositionEvent> {}
