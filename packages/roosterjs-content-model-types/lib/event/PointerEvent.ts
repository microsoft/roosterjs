import type { BasePluginDomEvent } from './BasePluginEvent';

/**
 * This interface represents a PluginEvent wrapping native PointerDown event
 */
export interface PointerDownEvent extends BasePluginDomEvent<'pointerDown', PointerEvent> {}

/**
 * This interface represents a PluginEvent wrapping native PointerUp event
 */
export interface PointerUpEvent extends BasePluginDomEvent<'pointerUp', PointerEvent> {}

/**
 * This interface represents a PluginEvent wrapping native PointerUp event
 */
export interface PointerDoubleClickEvent
    extends BasePluginDomEvent<'pointerDoubleClick', PointerEvent> {}
