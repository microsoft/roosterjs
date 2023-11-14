import type { ContentModelCachePluginState } from '../pluginState/ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from '../pluginState/ContentModelFormatPluginState';
import type { CopyPastePluginState, EditorPlugin, PluginWithState } from 'roosterjs-editor-types';

/**
 * Core plugins for standalone editor
 */
export interface StandaloneEditorCorePlugins {
    /**
     * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
     */
    readonly cache: PluginWithState<ContentModelCachePluginState>;

    /**
     * ContentModelFormat plugins helps editor to do formatting on top of content model.
     */
    readonly format: PluginWithState<ContentModelFormatPluginState>;

    /**
     * TypeInContainer plugin makes sure user is always type under a container element under editor DIV
     */
    readonly typeInContainer: EditorPlugin;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;
}
