import { CoreEditorCore } from '../editor/CoreEditorCore';
import { PluginEvent } from '../event/PluginEvent';

/**
 * Trigger a plugin event
 * @param core The CoreEditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (
    core: CoreEditorCore,
    pluginEvent: PluginEvent,
    broadcast: boolean
) => void;
