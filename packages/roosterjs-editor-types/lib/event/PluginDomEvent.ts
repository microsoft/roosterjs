import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * This represents a PluginEvent wrapping native CompositionEnd event
 */
export interface PluginCompositionEvent extends BasePluginEvent<PluginEventType.CompositionEnd> {
    rawEvent: CompositionEvent;
}

/**
 * This represents a PluginEvent wrapping native MouseDown event
 */
export interface PluginMouseDownEvent extends BasePluginEvent<PluginEventType.MouseDown> {
    rawEvent: MouseEvent;
}

/**
 * This represents a PluginEvent wrapping native MouseUp event
 */
export interface PluginMouseUpEvent extends BasePluginEvent<PluginEventType.MouseUp> {
    rawEvent: MouseEvent;
}

/**
 * This represents a PluginEvent wrapping native Mouse event
 */
export type PluginMouseEvent = PluginMouseDownEvent | PluginMouseUpEvent;

/**
 * This represents a PluginEvent wrapping native KeyDown event
 */
export interface PluginKeyDownEvent extends BasePluginEvent<PluginEventType.KeyDown> {
    rawEvent: KeyboardEvent;
}

/**
 * This represents a PluginEvent wrapping native KeyPress event
 */
export interface PluginKeyPressEvent extends BasePluginEvent<PluginEventType.KeyPress> {
    rawEvent: KeyboardEvent;
}

/**
 * This represents a PluginEvent wrapping native KeyUp event
 */
export interface PluginKeyUpEvent extends BasePluginEvent<PluginEventType.KeyUp> {
    rawEvent: KeyboardEvent;
}

/**
 * The represents a PluginEvent wrapping native Keyboard event
 */
export type PluginKeyboardEvent = PluginKeyDownEvent | PluginKeyPressEvent | PluginKeyUpEvent;

/**
 * This represents a PluginEvent wrapping native input / textinput event
 */
export interface PluginInputEvent extends BasePluginEvent<PluginEventType.Input> {
    rawEvent: InputEvent;
}

export interface PluginScrollEvent extends BasePluginEvent<PluginEventType.Scroll> {
    rawEvent: UIEvent;
    scrollContainer: HTMLElement;
}

/**
 * This represents a PluginEvent wrapping native browser event
 */
export type PluginDomEvent =
    | PluginCompositionEvent
    | PluginMouseEvent
    | PluginKeyboardEvent
    | PluginInputEvent
    | PluginScrollEvent;
