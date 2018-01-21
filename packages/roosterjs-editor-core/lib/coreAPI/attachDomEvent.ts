import EditorCore from '../editor/EditorCore';
import triggerEvent from './triggerEvent';
import { PluginEventType, PluginDomEvent } from 'roosterjs-editor-types';

export default function attachDomEvent(
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
): () => void {
    let onEvent = (event: UIEvent) => {
        if (beforeDispatch) {
            beforeDispatch(event);
        }
        if (pluginEventType != null) {
            triggerEvent(core, <PluginDomEvent>{
                eventType: pluginEventType,
                rawEvent: event,
            }, false /*broadcast*/);
        }
    };
    core.contentDiv.addEventListener(eventName, onEvent);
    return () => {
        core.contentDiv.removeEventListener(eventName, onEvent);
    }
}
