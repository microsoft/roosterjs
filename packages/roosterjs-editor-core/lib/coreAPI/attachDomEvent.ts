import EditorCore, { AttachDomEvent } from '../interfaces/EditorCore';
import { PluginDomEvent, PluginEventType } from 'roosterjs-editor-types';

const attachDomEvent: AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => {
    let onEvent = (event: UIEvent) => {
        // Stop propagation of a printable keyboard event (a keyboard event which is caused by printable char input).
        // This detection is not 100% accurate. event.key is not fully supported by all brwosers, and in some browser (e.g. IE)
        // event.key is longer than 1 for num pad input. But here we just want to improve performance as mush as possible.
        // So if we missed some case here it is still acceptable.
        if (
            isKeyboardEvent(event) &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey &&
            event.key &&
            event.key.length == 1
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

export default attachDomEvent;

function isKeyboardEvent(e: UIEvent): e is KeyboardEvent {
    return e.type == 'keydown' || e.type == 'keypress' || e.type == 'keyup';
}
