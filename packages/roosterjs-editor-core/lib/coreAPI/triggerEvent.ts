import EditorCore, { TriggerEvent } from '../interfaces/EditorCore';
import EditorPlugin from '../interfaces/EditorPlugin';
import { PluginEvent } from 'roosterjs-editor-types';

const triggerEvent: TriggerEvent = (
    core: EditorCore,
    pluginEvent: PluginEvent,
    broadcast: boolean
) => {
    if (
        broadcast ||
        !core.eventHandlerPlugins.some(plugin => handledExclusively(pluginEvent, plugin))
    ) {
        core.eventHandlerPlugins.forEach(plugin => {
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
