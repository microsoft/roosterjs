import EditorPlugin from './EditorPlugin';
import PluginWithState from './PluginWithState';
import UndoPluginState from '../corePlugins/undo/UndoPluginState';
import { BrowserInfo, Wrapper } from 'roosterjs-editor-types';
import { DarkModePluginState } from '../corePlugins/darkMode/DarkModePlugin';
import { DOMEventPluginState } from '../corePlugins/domEvent/DOMEventPlugin';
import { EntityPluginState } from '../corePlugins/entity/EntityPlugin';
import { GenericContentEditFeature } from './ContentEditFeature';
import { LifecyclePluginState } from '../corePlugins/lifecycle/LifecyclePlugin';
import { PendingFormatStatePluginState } from '../corePlugins/pendingFormatState/PendingFormatStatePlugin';
import { PluginEvent } from 'roosterjs-editor-types';

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
     * Auto complete plugin handles the undo operation for an auto complete action
     */
    readonly autoComplete: PluginWithState<string>;

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
    readonly typeAfterLink: PluginWithState<BrowserInfo>;

    /**
     * Dark mode plguin for handling dark mode copy.
     */
    readonly darkMode: PluginWithState<DarkModePluginState>;

    /**
     * Core paste plugin for handling onPaste event and extract the pasted content
     */
    readonly paste: EditorPlugin;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;
}

export type PluginKey = keyof CorePlugins;

export type KeyOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Key
    : never;

export type TypeOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Wrapper<U>
    : never;

export type StatePluginKeys<Key extends PluginKey> = { [P in Key]: KeyOfStatePlugin<P> }[Key];

export type PluginState<Key extends PluginKey> = {
    [P in StatePluginKeys<Key>]: TypeOfStatePlugin<P>;
};
