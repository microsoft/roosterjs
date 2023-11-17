import { createEditPlugin } from './EditPlugin';
import { createEntityPlugin } from './EntityPlugin';
import { createImageSelection } from './ImageSelection';
import { createLifecyclePlugin } from './LifecyclePlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import { createUndoPlugin } from './UndoPlugin';
import type { UnportedCorePlugins } from '../publicTypes/ContentModelCorePlugins';
import type { UnportedCorePluginState } from 'roosterjs-content-model-types';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export interface CreateCorePluginResponse extends UnportedCorePlugins {
    _placeholder: null;
}

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
        edit: map.edit || createEditPlugin(),
        _placeholder: null,
        undo: map.undo || createUndoPlugin(options),
        entity: map.entity || createEntityPlugin(),
        imageSelection: map.imageSelection || createImageSelection(),
        normalizeTable: map.normalizeTable || createNormalizeTablePlugin(),
        lifecycle: map.lifecycle || createLifecyclePlugin(options, contentDiv),
    };
}

/**
 * @internal
 * Get plugin state of core plugins
 * @param corePlugins ContentModelCorePlugins object
 */
export function getPluginState(corePlugins: UnportedCorePlugins): UnportedCorePluginState {
    return {
        edit: corePlugins.edit.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
    };
}
