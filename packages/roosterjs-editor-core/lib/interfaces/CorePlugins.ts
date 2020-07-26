import AutoCompletePlugin from '../corePlugins/AutoCompletePlugin';
import CorePastePlugin from '../corePlugins/CorePastePlugin';
import DarkModePlugin from '../corePlugins/DarkModePlugin';
import DOMEventPlugin from '../corePlugins/DOMEventPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import MouseUpPlugin from '../corePlugins/MouseUpPlugin';
import PluginWithState from './PluginWithState';
import TypeAfterLinkPlugin from '../corePlugins/TypeAfterLinkPlugin';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import UndoPlugin from '../corePlugins/UndoPlugin';
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
     * MouseUp plugin helps generate MouseUp event even mouse is out of editor area
     */
    readonly mouseUp: MouseUpPlugin;

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
