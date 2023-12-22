import type { ContextMenuPluginState } from './ContextMenuPluginState';
import type { EditorPlugin, EditPluginState, PluginWithState } from 'roosterjs-editor-types';

/**
 * An interface for Content Model editor core plugins
 */
export interface ContentModelCorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<EditPluginState>;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;

    /**
     * ContextMenu plugin handles Context Menu
     */
    readonly contextMenu: PluginWithState<ContextMenuPluginState>;
}

/**
 * Core plugin state for Content Model Editor
 */
export interface ContentModelCorePluginState {
    /**
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * Plugin state of ContextMenuPlugin
     */
    readonly contextMenu: ContextMenuPluginState;
}
