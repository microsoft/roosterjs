import type { ContentModelPluginEventType } from './ContentModelPluginEventType';
import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * A base interface of all DOM events
 */
export interface ContentModelPluginDomEventBase<
    TEventType extends ContentModelPluginEventType,
    TRawEvent extends Event
> extends ContentModelBasePluginEvent<TEventType> {
    /**
     * Raw DOM event
     */
    rawEvent: TRawEvent;
}

/**
 * This interface represents a PluginEvent wrapping native MouseUp event
 */
export interface ContentModelPluginMouseUpEvent
    extends ContentModelPluginDomEventBase<'mouseUp', MouseEvent> {
    /**
     * Whether this is a mouse click event (mouse up and down on the same position)
     */
    isClicking?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native MouseDown event
 */
export interface ContentModelPluginMouseDownEvent
    extends ContentModelPluginDomEventBase<'mouseDown', MouseEvent> {}

/**
 * This interface represents a PluginEvent wrapping native ContextMenu event
 */
export interface ContentModelPluginContextMenuEvent
    extends ContentModelPluginDomEventBase<'contextMenu', MouseEvent> {
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
export interface ContentModelPluginScrollEvent
    extends ContentModelPluginDomEventBase<'scroll', Event> {
    /**
     * Current scroll container that triggers this scroll event
     */
    scrollContainer: HTMLElement;
}

/**
 * This interface represents a PluginEvent wrapping native KeyDown event
 */
export interface ContentModelPluginKeyDownEvent
    extends ContentModelPluginDomEventBase<'keyDown', KeyboardEvent> {
    /**
     * Whether this event is handled by edit feature
     */
    handledByEditFeature?: boolean;
}

/**
 * This interface represents a PluginEvent wrapping native KeyUp event
 */
export interface ContentModelPluginKeyUpEvent
    extends ContentModelPluginDomEventBase<'keyUp', KeyboardEvent> {}

/**
 * This interface represents a PluginEvent wrapping native input / textinput event
 */
export interface ContentModelPluginInputEvent
    extends ContentModelPluginDomEventBase<'input', InputEvent> {}

/**
 * This interface represents a PluginEvent wrapping native CompositionEnd event
 */
export interface ContentModelPluginCompositionEvent
    extends ContentModelPluginDomEventBase<'compositionEnd', CompositionEvent> {}
