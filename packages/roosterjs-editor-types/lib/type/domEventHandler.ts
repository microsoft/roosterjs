import { PluginEventType } from '../event/PluginEventType';

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction = (event: UIEvent) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventHandlerObject {
    /**
     * Type of pluign event. The DOM event will be mapped with this plugin event type
     */
    eventType: PluginEventType;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    handler: DOMEventHandlerFunction;
}

/**
 * Combined event handler type with all 3 posibilities
 */
export type DOMEventHandler = PluginEventType | DOMEventHandlerFunction | DOMEventHandlerObject;
