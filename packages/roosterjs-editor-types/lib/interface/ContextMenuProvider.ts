import type EditorPlugin from './EditorPlugin';

/**
 * An extended Editor plugin interface which supports providing context menu items
 */
export default interface ContextMenuProvider<T> extends EditorPlugin {
    getContextMenuItems: (target: Node) => T[] | null;
}
