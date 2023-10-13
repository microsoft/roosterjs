import type EditorPlugin from './EditorPlugin';

/**
 * An editor plugin which have a state object stored on editor core
 * so that editor and core api can access it
 */
export default interface PluginWithState<T> extends EditorPlugin {
    /**
     * Get plugin state object
     */
    getState(): T;
}
