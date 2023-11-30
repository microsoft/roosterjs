import { createEditPlugin } from './EditPlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import { createUndoPlugin } from './UndoPlugin';
import type { UnportedCorePlugins } from '../publicTypes/ContentModelCorePlugins';
import type { UnportedCorePluginState } from 'roosterjs-content-model-types';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';

/**
 * @internal
 * Create Core Plugins
 * @param options Editor options
 */
export function createCorePlugins(options: ContentModelEditorOptions): UnportedCorePlugins {
    const map = options.corePluginOverride || {};

    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        edit: map.edit || createEditPlugin(),
        undo: map.undo || createUndoPlugin(options),
        normalizeTable: map.normalizeTable || createNormalizeTablePlugin(),
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
        undo: corePlugins.undo.getState(),
    };
}
