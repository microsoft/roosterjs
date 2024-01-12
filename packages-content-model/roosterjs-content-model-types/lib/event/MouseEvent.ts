import type { BasePluginDomEvent } from './BasePluginEvent';

/**
 * This interface represents a PluginEvent wrapping native MouseDown event
 */
export interface MouseDownEvent extends BasePluginDomEvent<'mouseDown', MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native MouseUp event
 */
export interface MouseUpEvent extends BasePluginDomEvent<'mouseUp', MouseEvent> {
    /**
     * Whether this is a mouse click event (mouse up and down on the same position)
     */
    isClicking?: boolean;
}
