import { ContentModelCachePluginState } from './pluginState/ContentModelCachePluginState';
import { ContentModelEditorPlugin, ContentModelPluginWithState } from './ContentModelEditorPlugin';
import { ContentModelFormatPluginState } from './pluginState/ContentModelFormatPluginState';
import { ContentModelLifecyclePluginState } from './pluginState/ContentModelLifecyclePluginState';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export interface ContentModelCorePlugins {
    /**
     * Manage cached Content Model
     */
    readonly cache: ContentModelPluginWithState<ContentModelCachePluginState>;

    /**
     * Manage pending format of Content Model editor
     */
    readonly format: ContentModelPluginWithState<ContentModelFormatPluginState>;

    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: ContentModelEditorPlugin;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: ContentModelEditorPlugin;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: ContentModelEditorPlugin;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: ContentModelEditorPlugin;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: ContentModelEditorPlugin;

    /**
     * Manage selection of the editor
     */
    readonly selection: ContentModelEditorPlugin;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: ContentModelPluginWithState<ContentModelLifecyclePluginState>;
}

/**
 * Names of core plugins
 */
export type PluginKey = keyof ContentModelCorePlugins;

/**
 * Names of the core plugins that have plugin state
 */
export type KeyOfStatePlugin<
    Key extends PluginKey
> = ContentModelCorePlugins[Key] extends ContentModelPluginWithState<infer U> ? Key : never;

/**
 * Get type of a plugin with state
 */
export type TypeOfStatePlugin<
    Key extends PluginKey
> = ContentModelCorePlugins[Key] extends ContentModelPluginWithState<infer U> ? U : never;

/**
 * All names of plugins with plugin state
 */
export type StatePluginKeys<Key extends PluginKey> = { [P in Key]: KeyOfStatePlugin<P> }[Key];

/**
 * A type map from name of plugin with state to its plugin type
 */
export type GenericPluginState<Key extends PluginKey> = {
    [P in StatePluginKeys<Key>]: TypeOfStatePlugin<P>;
};

/**
 * Auto-calculated State object type for plugin with states
 */
export type ContentModelPluginState = GenericPluginState<PluginKey>;
