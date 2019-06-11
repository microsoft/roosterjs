import EditorCore, { AttachDomEvent } from '../interfaces/EditorCore';
import isCharacterValue from '../eventApi/isCharacterValue';
import { PluginDomEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventName The DOM event name
 * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
 * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
 */
export const attachDomEvent: AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => {
    let onEvent = (event: UIEvent) => {
        // Stop propagation of a printable keyboard event (a keyboard event which is caused by printable char input).
        // This detection is not 100% accurate. event.key is not fully supported by all browsers, and in some browsers (e.g. IE),
        // event.key is longer than 1 for num pad input. But here we just want to improve performance as much as possible.
        // So if we missed some case here it is still acceptable.
        if (
            (isKeyboardEvent(event) && isCharacterValue(event)) ||
            pluginEventType == PluginEventType.Input
        ) {
            event.stopPropagation();
        }

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
};

function isKeyboardEvent(e: UIEvent): e is KeyboardEvent {
    return e.type == 'keydown' || e.type == 'keypress' || e.type == 'keyup';
}
