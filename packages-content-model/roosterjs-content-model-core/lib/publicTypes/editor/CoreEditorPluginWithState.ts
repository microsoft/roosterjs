import type { CoreEditorPlugin } from './CoreEditorPlugin';

/**
 * @internal
 * An editor plugin which have a state object stored on editor core
 * so that editor and core api can access it
 */
export interface CoreEditorPluginWithState<T> extends CoreEditorPlugin {
    /**
     * Get plugin state object
     */
    getState(): T;
}
