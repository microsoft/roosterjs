import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface BeforeKeyboardEditingEvent extends BasePluginEvent<'beforeKeyboardEditing'> {
    /**
     * Raw DOM event
     */
    rawEvent: KeyboardEvent;
}
