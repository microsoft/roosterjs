import type { EditorPlugin } from './EditorPlugin';

/**
 * An extended Editor plugin interface which supports providing context menu items
 */
export interface ContextMenuProvider<T> extends EditorPlugin {
    /**
     * A callback to return context menu items
     * @param target Target node that triggered a ContextMenu event
     * @returns An array of context menu items, or null means no items needed
     */
    getContextMenuItems: (target: Node) => T[] | null;
}
