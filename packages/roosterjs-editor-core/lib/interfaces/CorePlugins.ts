import AutoCompletePlugin from '../corePlugins/autoComplete/AutoCompletePlugin';
import CorePastePlugin from '../corePlugins/corePaste/CorePastePlugin';
import DarkModePlugin from '../corePlugins/darkMode/DarkModePlugin';
import DOMEventPlugin from '../corePlugins/domEvent/DOMEventPlugin';
import EditPlugin from '../corePlugins/edit/EditPlugin';
import EntityPlugin from '../corePlugins/entity/EntityPlugin';
import LifecyclePlugin from '../corePlugins/lifecycle/LifecyclePlugin';
import PluginWithState from './PluginWithState';
import TypeAfterLinkPlugin from '../corePlugins/typeAfterLink/TypeAfterLinkPlugin';
import TypeInContainerPlugin from '../corePlugins/typeInContainer/TypeInContainerPlugin';
import UndoPlugin from '../corePlugins/undo/UndoPlugin';
import { Wrapper } from 'roosterjs-editor-types';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export default interface CorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: EditPlugin;

    /**
     * Auto complete plugin handles the undo operation for an auto complete action
     */
    readonly autoComplete: AutoCompletePlugin;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: UndoPlugin;

    /**
     * TypeInContainer plugin makes sure user is always type under a container element under editor DIV
     */
    readonly typeInContainer: TypeInContainerPlugin;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: DOMEventPlugin;

    /**
     * TypeAfterLinkPlugin plugin helps workaround a Firefox bug to allow type outside a hyperlink
     */
    readonly typeAfterLink: TypeAfterLinkPlugin;

    /**
     * Dark mode plguin for handling dark mode copy.
     */
    readonly darkMode: DarkModePlugin;

    /**
     * Core paste plugin for handling onPaste event and extract the pasted content
     */
    readonly paste: CorePastePlugin;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: EntityPlugin;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: LifecyclePlugin;
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
