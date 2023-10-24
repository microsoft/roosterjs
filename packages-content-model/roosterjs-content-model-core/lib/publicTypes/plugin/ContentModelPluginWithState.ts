import type { ContentModelEditorPlugin } from './ContentModelEditorPlugin';

/**
 * An editor plugin which have a state object stored on editor core
 * so that editor and core api can access it
 */
export interface ContentModelPluginWithState<T> extends ContentModelEditorPlugin {
    /**
     * Get plugin state object
     */
    getState(): T;
}
