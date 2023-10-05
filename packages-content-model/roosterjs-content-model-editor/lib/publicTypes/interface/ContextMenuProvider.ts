import { ContentModelEditorPlugin } from '../ContentModelEditorPlugin';

/**
 * An extended Editor plugin interface which supports providing context menu items
 */
export default interface ContextMenuProvider<T> extends ContentModelEditorPlugin {
    getContextMenuItems: (target: Node) => T[] | null;
}
