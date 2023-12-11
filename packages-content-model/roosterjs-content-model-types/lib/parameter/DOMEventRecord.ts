import type { PluginEventType } from 'roosterjs-editor-types';

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction<E = Event> = (event: E) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventRecord<E = Event> {
    /**
     * Type of plugin event. The DOM event will be mapped with this plugin event type
     */
    pluginEventType?: PluginEventType | null;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    beforeDispatch?: DOMEventHandlerFunction<E> | null;
}
