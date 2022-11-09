import CopyPastePluginState from '../corePluginState/CopyPastePluginState';
import DOMEventPluginState from '../corePluginState/DOMEventPluginState';
import EditorPlugin from './EditorPlugin';
import EditPluginState from '../corePluginState/EditPluginState';
import EntityPluginState from '../corePluginState/EntityPluginState';
import LifecyclePluginState from '../corePluginState/LifecyclePluginState';
import PendingFormatStatePluginState from '../corePluginState/PendingFormatStatePluginState';
import PluginWithState from './PluginWithState';
import UndoPluginState from '../corePluginState/UndoPluginState';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export default interface CorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<EditPluginState>;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: PluginWithState<UndoPluginState>;

    /**
     * TypeInContainer plugin makes sure user is always type under a container element under editor DIV
     */
    readonly typeInContainer: EditorPlugin;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: PluginWithState<DOMEventPluginState>;

    /**
     * PendingFormatStatePlugin handles pending format state management
     */
    readonly pendingFormatState: PluginWithState<PendingFormatStatePluginState>;

    /**
     * MouseUpPlugin help trigger MouseUp event even when mouse up happens outside editor
     * as long as the mouse was pressed within Editor before
     */
    readonly mouseUp: EditorPlugin;

    /**
     * @deprecated after Firefox update
     * TypeAfterLinkPlugin plugin helps workaround a Firefox bug to allow type outside a hyperlink
     */
    readonly typeAfterLink: EditorPlugin;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Image selection Plugin detects image selection and help highlight the image
     */
    readonly imageSelection: EditorPlugin;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;
}

/**
 * Names of core plugins
 */
export type PluginKey = keyof CorePlugins;

/**
 * Names of the core plugins that have plugin state
 */
export type KeyOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Key
    : never;

/**
 * Get type of a plugin with state
 */
export type TypeOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? U
    : never;

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
export type PluginState = GenericPluginState<PluginKey>;
