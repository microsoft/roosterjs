import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface ContentModelBeforeDisposeEvent
    extends ContentModelBasePluginEvent<'beforeDispose'> {}
