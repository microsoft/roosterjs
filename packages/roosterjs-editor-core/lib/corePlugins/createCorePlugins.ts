import CopyPastePlugin from './CopyPastePlugin';
import DOMEventPlugin from './DOMEventPlugin';
import EditPlugin from './EditPlugin';
import EntityPlugin from './EntityPlugin';
import LifecyclePlugin from './LifecyclePlugin';
import MouseUpPlugin from './MouseUpPlugin';
import PendingFormatStatePlugin from './PendingFormatStatePlugin';
import TypeAfterLinkPlugin from './TypeAfterLinkPlugin';
import TypeInContainerPlugin from './TypeInContainerPlugin';
import UndoPlugin from './UndoPlugin';
import { CorePlugins, EditorOptions, PluginState } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const PLACEHOLDER_PLUGIN_NAME = '_placeholder';

/**
 * @internal
 * Create Core Plugins
 * @param contentDiv Content DIV of editor
 * @param options Editor options
 */
export default function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): CorePlugins & { [PLACEHOLDER_PLUGIN_NAME]: null } {
    const map = options.corePluginOverride || {};
    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        typeInContainer: map.typeInContainer || new TypeInContainerPlugin(),
        edit: map.edit || new EditPlugin(),
        _placeholder: null,
        typeAfterLink: map.typeAfterLink || new TypeAfterLinkPlugin(),
        undo: map.undo || new UndoPlugin(options),
        domEvent: map.domEvent || new DOMEventPlugin(options, contentDiv),
        pendingFormatState: map.pendingFormatState || new PendingFormatStatePlugin(),
        mouseUp: map.mouseUp || new MouseUpPlugin(),
        copyPaste: map.copyPaste || new CopyPastePlugin(options),
        entity: map.entity || new EntityPlugin(),
        lifecycle: map.lifecycle || new LifecyclePlugin(options, contentDiv),
    };
}

/**
 * @internal
 * Get plugin state of core plugins
 * @param corePlugins CorePlugins object
 */
export function getPluginState(corePlugins: CorePlugins): PluginState {
    return {
        domEvent: corePlugins.domEvent.getState(),
        pendingFormatState: corePlugins.pendingFormatState.getState(),
        edit: corePlugins.edit.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
    };
}
