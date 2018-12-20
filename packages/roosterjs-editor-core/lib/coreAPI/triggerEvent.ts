import EditorCore, { TriggerEvent } from '../editor/EditorCore';
import EditorPlugin from '../editor/EditorPlugin';
import { PluginEvent } from 'roosterjs-editor-types';

const triggerEvent: TriggerEvent = (
    core: EditorCore,
    pluginEvent: PluginEvent,
    broadcast: boolean
) => {
    if (broadcast || !core.plugins.some(plugin => handledExclusively(pluginEvent, plugin))) {
        core.plugins.forEach(plugin => {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
};

function handledExclusively(event: PluginEvent, plugin: EditorPlugin): boolean {
    if (
        plugin.onPluginEvent &&
        plugin.willHandleEventExclusively &&
        plugin.willHandleEventExclusively(event)
    ) {
        plugin.onPluginEvent(event);
        return true;
    }

    return false;
}

export default triggerEvent;
