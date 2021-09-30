import { PluginEventType } from '../event/PluginEventType';

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction = (event: Event) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventHandlerObject {
    /**
     * Type of plugin event. The DOM event will be mapped with this plugin event type
     */
    pluginEventType: PluginEventType;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    beforeDispatch: DOMEventHandlerFunction;
}

/**
 * Combined event handler type with all 3 possibilities
 */
export type DOMEventHandler = PluginEventType | DOMEventHandlerFunction | DOMEventHandlerObject;
