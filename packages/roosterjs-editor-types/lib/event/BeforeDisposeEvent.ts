import type BasePluginEvent from './BasePluginEvent';
import type { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface BeforeDisposeEvent
    extends BasePluginEvent<PluginEventType.BeforeDispose> {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleBeforeDisposeEvent
    extends BasePluginEvent<CompatiblePluginEventType.BeforeDispose> {}
