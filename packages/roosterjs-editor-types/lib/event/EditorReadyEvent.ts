import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface EditorReadyEvent extends BasePluginEvent<PluginEventType.EditorReady> {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleEditorReadyEvent
    extends BasePluginEvent<CompatiblePluginEventType.EditorReady> {}
