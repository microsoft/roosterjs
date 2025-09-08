import type { BasePluginDomEvent } from './BasePluginEvent';

/**
 * This interface represents a PluginEvent wrapping native PointerDown event
 */
export interface PointerDownEvent extends BasePluginDomEvent<'pointerDown', PointerEvent> {}
