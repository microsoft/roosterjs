import { PluginEventType } from '../event/PluginEventType';

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction = (event: UIEvent) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export type DOMEventHandlerObject = {
    eventType: PluginEventType;
    handler: DOMEventHandlerFunction;
};

/**
 * Combined event handler type with all 3 posibilities
 */
export type DOMEventHandler = PluginEventType | DOMEventHandlerFunction | DOMEventHandlerObject;
