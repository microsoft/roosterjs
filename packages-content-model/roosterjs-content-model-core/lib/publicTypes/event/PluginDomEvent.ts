import type { PluginEventType } from './PluginEventType';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * A base interface of all DOM events
 */
export interface PluginDomEventBase<TEventType extends PluginEventType, TRawEvent extends Event>
    extends BasePluginEvent<TEventType> {
    /**
     * Raw DOM event
     */
    rawEvent: TRawEvent;
}

/**
 * This interface represents a PluginEvent wrapping native MouseUp event
 */
export interface PluginMouseUpEvent extends PluginDomEventBase<'mouseUp', MouseEvent> {
    /**
     * Whether this is a mouse click event (mouse up and down on the same position)
     */
    isClicking?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native MouseDown event
 */
export interface PluginMouseDownEvent extends PluginDomEventBase<'mouseDown', MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface PluginContextMenuEvent extends PluginDomEventBase<'contextMenu', MouseEvent> {
    /**
     * A callback array to let editor retrieve context menu item related to this event.
     * Plugins can add their own getter callback to this array,
     * items from each getter will be separated by a splitter item represented by null
     */
    items: any[];
}

/**
 * This interface represents a PluginEvent wrapping native scroll event
 */
export interface PluginScrollEvent extends PluginDomEventBase<'scroll', Event> {
    /**
     * Current scroll container that triggers this scroll event
     */
    scrollContainer: HTMLElement;
}

/**
 * This interface represents a PluginEvent wrapping native KeyDown event
 */
export interface PluginKeyDownEvent extends PluginDomEventBase<'keyDown', KeyboardEvent> {
    /**
     * Whether this event is handled by edit feature
     */
    handledByEditFeature?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native KeyUp event
 */
export interface PluginKeyUpEvent extends PluginDomEventBase<'keyUp', KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native input / textinput event
 */
export interface PluginInputEvent extends PluginDomEventBase<'input', InputEvent> {}

/**
 * This interface represents a PluginEvent wrapping native CompositionEnd event
 */
export interface PluginCompositionEvent
    extends PluginDomEventBase<'compositionEnd', CompositionEvent> {}
