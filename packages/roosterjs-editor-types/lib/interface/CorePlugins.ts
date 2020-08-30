import DOMEventPluginState from '../corePluginState/DOMEventPluginState';
import EditorPlugin from './EditorPlugin';
import EntityPluginState from '../corePluginState/EntityPluginState';
import LifecyclePluginState from '../corePluginState/LifecyclePluginState';
import PendingFormatStatePluginState from '../corePluginState/PendingFormatStatePluginState';
import PluginWithState from './PluginWithState';
import UndoPluginState from '../corePluginState/UndoPluginState';
import Wrapper from './Wrapper';
import { GenericContentEditFeature } from './ContentEditFeature';
import { PluginEvent } from '../event/PluginEvent';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export default interface CorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<Record<number, GenericContentEditFeature<PluginEvent>[]>>;

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
     * TypeAfterLinkPlugin plugin helps workaround a Firefox bug to allow type outside a hyperlink
     */
    readonly typeAfterLink: EditorPlugin;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: EditorPlugin;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;
}

/**
 * @internal
 */
export type PluginKey = keyof CorePlugins;

/**
 * @internal
 */
export type KeyOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Key
    : never;

/**
 * @internal
 */
export type TypeOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Wrapper<U>
    : never;

/**
 * @internal
 */
export type StatePluginKeys<Key extends PluginKey> = { [P in Key]: KeyOfStatePlugin<P> }[Key];

/**
 * @internal
 */
export type GenericPluginState<Key extends PluginKey> = {
    [P in StatePluginKeys<Key>]: TypeOfStatePlugin<P>;
};

/**
 * Auto-calculated State object type for plugin with states
 */
export type PluginState = GenericPluginState<PluginKey>;
