import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface BeforeDisposeEvent
    extends BasePluginEvent<PluginEventType.BeforeDispose> {}
