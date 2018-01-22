import EditorCore from '../editor/EditorCore';
import { PluginEvent } from 'roosterjs-editor-types';

export default function triggerEvent(
    core: EditorCore,
    pluginEvent: PluginEvent,
    broadcast: boolean
) {
    let isHandledExclusively = false;
    if (!broadcast) {
        for (let i = 0; i < core.plugins.length; i++) {
            let plugin = core.plugins[i];
            if (
                plugin.willHandleEventExclusively &&
                plugin.onPluginEvent &&
                plugin.willHandleEventExclusively(pluginEvent)
            ) {
                plugin.onPluginEvent(pluginEvent);
                isHandledExclusively = true;
                break;
            }
        }
    }

    if (!isHandledExclusively) {
        core.plugins.forEach(plugin => {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
}
