import { getObjectKeys } from 'roosterjs-editor-dom';
import {
    AttachDomEvent,
    DOMEventHandler,
    DOMEventHandlerObject,
    EditorCore,
    PluginDomEvent,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventName The DOM event name
 * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
 * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
 */
export const attachDomEvent: AttachDomEvent = (
    core: EditorCore,
    eventMap: Record<string, DOMEventHandler>
) => {
    const disposers = getObjectKeys(eventMap || {}).map(key => {
        const { pluginEventType, beforeDispatch } = extractHandler(eventMap[key]);
        const eventName = key as keyof HTMLElementEventMap;
        let onEvent = (event: HTMLElementEventMap[typeof eventName]) => {
            if (beforeDispatch) {
                beforeDispatch(event);
            }
            if (pluginEventType != null) {
                core.api.triggerEvent(
                    core,
                    <PluginDomEvent>{
                        eventType: pluginEventType,
                        rawEvent: event,
                    },
                    false /*broadcast*/
                );
            }
        };

        core.contentDiv.addEventListener(eventName, onEvent);

        return () => {
            core.contentDiv.removeEventListener(eventName, onEvent);
        };
    });
    return () => disposers.forEach(disposers => disposers());
};

function extractHandler(handlerObj: DOMEventHandler): DOMEventHandlerObject {
    let result: DOMEventHandlerObject = {
        pluginEventType: null,
        beforeDispatch: null,
    };

    if (typeof handlerObj === 'number') {
        result.pluginEventType = handlerObj;
    } else if (typeof handlerObj === 'function') {
        result.beforeDispatch = handlerObj;
    } else if (typeof handlerObj === 'object') {
        result = handlerObj;
    }
    return result;
}
