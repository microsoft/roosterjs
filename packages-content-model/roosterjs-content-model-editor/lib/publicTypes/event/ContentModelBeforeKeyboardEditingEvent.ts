import BasePluginEvent from './BasePluginEvent';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface ContentModelBeforeKeyboardEditingEvent
    extends BasePluginEvent<'beforeKeyboardEditing'> {
    /**
     * Raw DOM event
     */
    rawEvent: KeyboardEvent;
}
