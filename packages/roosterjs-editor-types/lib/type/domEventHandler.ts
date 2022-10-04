import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction<E = Event> = (event: E) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventHandlerObject {
    /**
     * Type of plugin event. The DOM event will be mapped with this plugin event type
     */
    pluginEventType: PluginEventType | CompatiblePluginEventType | null;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    beforeDispatch: DOMEventHandlerFunction | null;
}

/**
 * Combined event handler type with all 3 possibilities
 */
export type DOMEventHandler<E = Event> =
    | PluginEventType
    | CompatiblePluginEventType
    | DOMEventHandlerFunction<E>
    | DOMEventHandlerObject;
