import { createDOMEventPlugin } from './DOMEventPlugin';
import { createEditPlugin } from './EditPlugin';
import { createEntityPlugin } from './EntityPlugin';
import { createImageSelection } from './ImageSelection';
import { createLifecyclePlugin } from './LifecyclePlugin';
import { createMouseUpPlugin } from './MouseUpPlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import { createPendingFormatStatePlugin } from './PendingFormatStatePlugin';
import { createStandaloneEditorCorePlugins } from 'roosterjs-content-model-core';
import { createUndoPlugin } from './UndoPlugin';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { CorePlugins, PluginState } from 'roosterjs-editor-types';
import type {
    ContentModelPluginState,
    StandaloneEditorCorePlugins,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export type CreateCorePluginResponse = CorePlugins &
    StandaloneEditorCorePlugins & {
        _placeholder: null;
    };

/**
 * @internal
 * Create Core Plugins
 * @param contentDiv Content DIV of editor
 * @param options Editor options
 */
export function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: ContentModelEditorOptions
): CreateCorePluginResponse {
    const map = options.corePluginOverride || {};

    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        ...createStandaloneEditorCorePlugins(options),
        edit: map.edit || createEditPlugin(),
        pendingFormatState: map.pendingFormatState || createPendingFormatStatePlugin(),
        _placeholder: null,
        typeAfterLink: null!, //deprecated after firefox update
        undo: map.undo || createUndoPlugin(options),
        domEvent: map.domEvent || createDOMEventPlugin(options, contentDiv),
        mouseUp: map.mouseUp || createMouseUpPlugin(),
        entity: map.entity || createEntityPlugin(),
        imageSelection: map.imageSelection || createImageSelection(),
        normalizeTable: map.normalizeTable || createNormalizeTablePlugin(),
        lifecycle: map.lifecycle || createLifecyclePlugin(options, contentDiv),
    };
}

/**
 * @internal
 * Get plugin state of core plugins
 * @param corePlugins CorePlugins object
 */
export function getPluginState(
    corePlugins: CorePlugins & StandaloneEditorCorePlugins
): PluginState & ContentModelPluginState {
    return {
        domEvent: corePlugins.domEvent.getState(),
        pendingFormatState: corePlugins.pendingFormatState.getState(),
        edit: corePlugins.edit.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
    };
}
