import type {
    CopyPastePluginState,
    DOMEventPluginState,
    EditorPlugin,
    EntityPluginState,
    LifecyclePluginState,
    PluginWithState,
    UndoPluginState,
} from 'roosterjs-editor-types';
import type { ContentModelCachePluginState } from './ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from './ContentModelFormatPluginState';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export interface ContentModelCorePlugins {
    /**
     * Plugin state for ContentModelCachePlugin
     */
    readonly cache: PluginWithState<ContentModelCachePluginState>;

    /**
     * Plugin state for ContentModelFormatPlugin
     */
    readonly format: PluginWithState<ContentModelFormatPluginState>;

    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: EditorPlugin;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: PluginWithState<UndoPluginState>;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: PluginWithState<DOMEventPluginState>;

    /**
     * Plugin state for ContentModelCopyPastePlugin
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Selection plugin handles table and image selection
     */
    readonly selection: PluginWithState<SelectionPluginState>;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;

    // /**
    //  * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
    //  */
    // readonly normalizeTable: EditorPlugin;
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
> = ContentModelCorePlugins[Key] extends PluginWithState<infer U> ? Key : never;

/**
 * Get type of a plugin with state
 */
export type TypeOfStatePlugin<
    Key extends PluginKey
> = ContentModelCorePlugins[Key] extends PluginWithState<infer U> ? U : never;

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
export type ContentModelPluginStates = GenericPluginState<PluginKey>;
