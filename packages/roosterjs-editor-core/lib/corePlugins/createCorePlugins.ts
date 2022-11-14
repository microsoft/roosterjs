import CopyPastePlugin from './CopyPastePlugin';
import DOMEventPlugin from './DOMEventPlugin';
import EditPlugin from './EditPlugin';
import EntityPlugin from './EntityPlugin';
import ImageSelection from './ImageSelection';
import LifecyclePlugin from './LifecyclePlugin';
import MouseUpPlugin from './MouseUpPlugin';
import NormalizeTablePlugin from './NormalizeTablePlugin';
import PendingFormatStatePlugin from './PendingFormatStatePlugin';
import TypeInContainerPlugin from './TypeInContainerPlugin';
import UndoPlugin from './UndoPlugin';
import { CorePlugins, EditorOptions, PluginState } from 'roosterjs-editor-types';

/**
 * @internal
 */
export interface CreateCorePluginResponse extends CorePlugins {
    _placeholder: null;
}

/**
 * @internal
 * Create Core Plugins
 * @param contentDiv Content DIV of editor
 * @param options Editor options
 */
export default function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): CreateCorePluginResponse {
    const map = options.corePluginOverride || {};
    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        typeInContainer: map.typeInContainer || new TypeInContainerPlugin(),
        edit: map.edit || new EditPlugin(),
        pendingFormatState: map.pendingFormatState || new PendingFormatStatePlugin(),
        _placeholder: null,
        typeAfterLink: null!, //deprecated after firefox update
        undo: map.undo || new UndoPlugin(options),
        domEvent: map.domEvent || new DOMEventPlugin(options, contentDiv),
        mouseUp: map.mouseUp || new MouseUpPlugin(),
        copyPaste: map.copyPaste || new CopyPastePlugin(options),
        entity: map.entity || new EntityPlugin(),
        imageSelection: map.imageSelection || new ImageSelection(),
        normalizeTable: map.normalizeTable || new NormalizeTablePlugin(),
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
