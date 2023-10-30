import type { PluginEventType } from '../event/PluginEventType';

/**
 * @internal
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction<TEvent = Event> = (event: TEvent) => void;

/**
 * @internal
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventHandlerObject {
    /**
     * Type of plugin event. The DOM event will be mapped with this plugin event type
     */
    pluginEventType: PluginEventType | null;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    beforeDispatch: DOMEventHandlerFunction | null;
}

/**
 * @internal
 * Combined event handler type with all 3 possibilities
 */
export type DOMEventHandler<TEvent = Event> =
    | PluginEventType
    | DOMEventHandlerFunction<TEvent>
    | DOMEventHandlerObject;
