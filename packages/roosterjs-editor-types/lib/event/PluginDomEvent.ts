import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';

/**
 * A base interface of all DOM events
 */
export interface PluginDomEventBase<TEventType extends PluginEventType, TRawEvent extends Event>
    extends BasePluginEvent<TEventType> {
    rawEvent: TRawEvent;
}

/**
 * This interface represents a PluginEvent wrapping native CompositionEnd event
 */
export interface PluginCompositionEvent
    extends PluginDomEventBase<PluginEventType.CompositionEnd, CompositionEvent> {}

/**
 * This interface represents a PluginEvent wrapping native MouseDown event
 */
export interface PluginMouseDownEvent
    extends PluginDomEventBase<PluginEventType.MouseDown, MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native MouseUp event
 */
export interface PluginMouseUpEvent
    extends PluginDomEventBase<PluginEventType.MouseUp, MouseEvent> {
    /**
     * Whether this is a mouse click event (mouse up and down on the same position)
     */
    isClicking?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface PluginContextMenuEvent
    extends PluginDomEventBase<PluginEventType.ContextMenu, MouseEvent> {
    /**
     * A callback array to let editor retrieve context menu item related to this event.
     * Plugins can add their own getter callback to this array,
     * items from each getter will be separated by a splitter item represented by null
     */
    items: any[];
}

/**
 * This interface represents a PluginEvent wrapping native Mouse event
 */
export type PluginMouseEvent = PluginMouseDownEvent | PluginMouseUpEvent | PluginContextMenuEvent;

/**
 * This interface represents a PluginEvent wrapping native KeyDown event
 */
export interface PluginKeyDownEvent
    extends PluginDomEventBase<PluginEventType.KeyDown, KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native KeyPress event
 */
export interface PluginKeyPressEvent
    extends PluginDomEventBase<PluginEventType.KeyPress, KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native KeyUp event
 */
export interface PluginKeyUpEvent
    extends PluginDomEventBase<PluginEventType.KeyUp, KeyboardEvent> {}

/**
 * The interface represents a PluginEvent wrapping native Keyboard event
 */
export type PluginKeyboardEvent = PluginKeyDownEvent | PluginKeyPressEvent | PluginKeyUpEvent;

/**
 * This interface represents a PluginEvent wrapping native input / textinput event
 */
export interface PluginInputEvent extends PluginDomEventBase<PluginEventType.Input, InputEvent> {}

/**
 * This interface represents a PluginEvent wrapping native scroll event
 */
export interface PluginScrollEvent extends PluginDomEventBase<PluginEventType.Scroll, UIEvent> {
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
