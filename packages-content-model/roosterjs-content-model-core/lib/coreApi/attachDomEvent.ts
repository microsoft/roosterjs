import { getObjectKeys } from 'roosterjs-content-model-dom';
import type { AttachDomEvent, PluginEvent } from 'roosterjs-content-model-types';

/**
 * @internal
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventName The DOM event name
 * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
 * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
 */
export const attachDomEvent: AttachDomEvent = (core, eventMap) => {
    const disposers = getObjectKeys(eventMap || {}).map(key => {
        const { pluginEventType, beforeDispatch } = eventMap[key];
        const eventName = key as keyof HTMLElementEventMap;
        const onEvent = (event: HTMLElementEventMap[typeof eventName]) => {
            if (beforeDispatch) {
                beforeDispatch(event);
            }

            if (pluginEventType != null) {
                core.api.triggerEvent(
                    core,
                    <PluginEvent>{
                        eventType: pluginEventType,
                        rawEvent: event,
                    },
                    false /*broadcast*/
                );
            }
        };

        core.logicalRoot.addEventListener(eventName, onEvent);

        return () => {
            core.logicalRoot.removeEventListener(eventName, onEvent);
        };
    });

    return () => disposers.forEach(disposers => disposers());
};
