import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface ContentModelBeforeKeyboardEditingEvent
    extends ContentModelBasePluginEvent<'beforeKeyboardEditing'> {
    /**
     * Raw DOM event
     */
    rawEvent: KeyboardEvent;
}
