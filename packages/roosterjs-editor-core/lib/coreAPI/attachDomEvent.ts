import EditorCore, { AttachDomEvent } from '../editor/EditorCore';
import { PluginEventType, PluginDomEvent } from 'roosterjs-editor-types';

const attachDomEvent: AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => {
    let onEvent = (event: UIEvent) => {
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
