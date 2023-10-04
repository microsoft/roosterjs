import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * Data of BeforeKeyboardEditing
 */
export interface BeforeKeyboardEditingData {}

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export default interface ContentModelBeforeKeyboardEditingEvent
    extends ContentModelBasePluginEvent<'beforeKeyboardEditing'> {
    /**
     * Raw DOM event
     */
    rawEvent: KeyboardEvent;
}
