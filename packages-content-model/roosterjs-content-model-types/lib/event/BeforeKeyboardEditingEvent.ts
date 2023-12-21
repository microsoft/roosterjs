import { BasePluginDomEvent } from './BasePluginDomEvent';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface BeforeKeyboardEditingEvent
    extends BasePluginDomEvent<'beforeKeyboardEditing', KeyboardEvent> {}
