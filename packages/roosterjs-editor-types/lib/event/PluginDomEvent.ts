import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of PluginMouseUpEvent
 */
export interface PluginMouseUpEventData {
    /**
     * Whether this is a mouse click event (mouse up and down on the same position)
     */
    isClicking?: boolean;
}

/**
 * Data of PluginContextMenuEvent
 */
export interface PluginContextMenuEventData {
    /**
     * A callback array to let editor retrieve context menu item related to this event.
     * Plugins can add their own getter callback to this array,
     * items from each getter will be separated by a splitter item represented by null
     */
    items: any[];
}

/**
 * Data of PluginScrollEvent
 */
export interface PluginScrollEventData {
    /**
     * Current scroll container that triggers this scroll event
     */
    scrollContainer: HTMLElement;
}

/**
 * A base interface of all DOM events
 */
export interface PluginDomEventBase<
    TEventType extends PluginEventType | CompatiblePluginEventType,
    TRawEvent extends Event
> extends BasePluginEvent<TEventType> {
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
    extends PluginMouseUpEventData,
        PluginDomEventBase<PluginEventType.MouseUp, MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface PluginContextMenuEvent
    extends PluginContextMenuEventData,
        PluginDomEventBase<PluginEventType.ContextMenu, MouseEvent> {}

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
export interface PluginScrollEvent
    extends PluginScrollEventData,
        PluginDomEventBase<PluginEventType.Scroll, Event> {}

/**
 * This interface represents a PluginEvent wrapping native CompositionEnd event
 */
export interface CompatiblePluginCompositionEvent
    extends PluginDomEventBase<CompatiblePluginEventType.CompositionEnd, CompositionEvent> {}

/**
 * This interface represents a PluginEvent wrapping native MouseDown event
 */
export interface CompatiblePluginMouseDownEvent
    extends PluginDomEventBase<CompatiblePluginEventType.MouseDown, MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native MouseUp event
 */
export interface CompatiblePluginMouseUpEvent
    extends PluginMouseUpEventData,
        PluginDomEventBase<CompatiblePluginEventType.MouseUp, MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface CompatiblePluginContextMenuEvent
    extends PluginContextMenuEventData,
        PluginDomEventBase<CompatiblePluginEventType.ContextMenu, MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native Mouse event
 */
export type CompatiblePluginMouseEvent =
    | CompatiblePluginMouseDownEvent
    | CompatiblePluginMouseUpEvent
    | CompatiblePluginContextMenuEvent;

/**
 * This interface represents a PluginEvent wrapping native KeyDown event
 */
export interface CompatiblePluginKeyDownEvent
    extends PluginDomEventBase<CompatiblePluginEventType.KeyDown, KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native KeyPress event
 */
export interface CompatiblePluginKeyPressEvent
    extends PluginDomEventBase<CompatiblePluginEventType.KeyPress, KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native KeyUp event
 */
export interface CompatiblePluginKeyUpEvent
    extends PluginDomEventBase<CompatiblePluginEventType.KeyUp, KeyboardEvent> {}

/**
 * The interface represents a PluginEvent wrapping native Keyboard event
 */
export type CompatiblePluginKeyboardEvent =
    | CompatiblePluginKeyDownEvent
    | CompatiblePluginKeyPressEvent
    | CompatiblePluginKeyUpEvent;

/**
 * This interface represents a PluginEvent wrapping native input / textinput event
 */
export interface CompatiblePluginInputEvent
    extends PluginDomEventBase<CompatiblePluginEventType.Input, InputEvent> {}

/**
 * This interface represents a PluginEvent wrapping native scroll event
 */
export interface CompatiblePluginScrollEvent
    extends PluginScrollEventData,
        PluginDomEventBase<CompatiblePluginEventType.Scroll, UIEvent> {}

/**
 * This represents a PluginEvent wrapping native browser event
 */
export type PluginDomEvent =
    | PluginCompositionEvent
    | PluginMouseEvent
    | PluginKeyboardEvent
    | PluginInputEvent
    | PluginScrollEvent;

/**
 * This represents a PluginEvent wrapping native browser event
 */
export type CompatiblePluginDomEvent =
    | CompatiblePluginCompositionEvent
    | CompatiblePluginMouseEvent
    | CompatiblePluginKeyboardEvent
    | CompatiblePluginInputEvent
    | CompatiblePluginScrollEvent;
