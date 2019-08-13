import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

export default interface DarkModeChangedEvent
    extends BasePluginEvent<PluginEventType.DarkModeChanged> {
    changedToDarkMode: boolean;
}
