import { EditorPlugin } from '../publicTypes/plugin/EditorPlugin';
import { PluginEvent } from '../publicTypes/event/PluginEvent';
import { PluginEventType } from '../publicTypes/event/PluginEventType';
import { TriggerEvent } from '../publicTypes/coreApi/TriggerEvent';

const allowedEventsInShadowEdit: PluginEventType[] = [
    'editorReady',
    'beforeDispose',
    'extractContentWithDom',
    'zoomChanged',
];

/**
 * @internal
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export const triggerEvent: TriggerEvent = (core, pluginEvent, broadcast) => {
    if (
        (!core.lifecycle.isInShadowEdit ||
            allowedEventsInShadowEdit.indexOf(pluginEvent.eventType) >= 0) &&
        (broadcast || !core.plugins.some(plugin => handledExclusively(pluginEvent, plugin)))
    ) {
        core.plugins.forEach(plugin => {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
};

function handledExclusively(event: PluginEvent, plugin: EditorPlugin): boolean {
    if (plugin.onPluginEvent && plugin.willHandleEventExclusively?.(event)) {
        plugin.onPluginEvent(event);
        return true;
    }

    return false;
}
