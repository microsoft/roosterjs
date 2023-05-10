import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of BeforeKeyboardEditing
 */
export interface BeforeKeyboardEditingData {
    /**
     * Raw DOM event
     */
    rawEvent: KeyboardEvent;
}

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export default interface BeforeKeyboardEditingEvent
    extends BeforeKeyboardEditingData,
        BasePluginEvent<PluginEventType.BeforeKeyboardEditing> {}

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface CompatibleBeforeKeyboardEditingEvent
    extends BeforeKeyboardEditingData,
        BasePluginEvent<CompatiblePluginEventType.BeforeKeyboardEditing> {}
