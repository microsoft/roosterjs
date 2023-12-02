import type { StandaloneEditorCorePlugins } from 'roosterjs-content-model-types';
import type { EditPluginState, EditorPlugin, PluginWithState } from 'roosterjs-editor-types';

/**
 * An interface for unported core plugins
 * TODO: Port these plugins
 */
export interface UnportedCorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<EditPluginState>;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;
}

/**
 * An interface for Content Model editor core plugins.
 */
export interface ContentModelCorePlugins extends StandaloneEditorCorePlugins, UnportedCorePlugins {}
