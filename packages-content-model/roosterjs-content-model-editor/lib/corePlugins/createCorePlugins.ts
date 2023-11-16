import { createEditPlugin } from './EditPlugin';
import { createImageSelection } from './ImageSelection';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import { createStandaloneEditorCorePlugins } from 'roosterjs-content-model-core';
import { createUndoPlugin } from './UndoPlugin';
import type { EditorPlugin } from 'roosterjs-editor-types';
import type { ContentModelCorePlugins } from '../publicTypes/ContentModelCorePlugins';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { ContentModelPluginState } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create Core Plugins
 * @param contentDiv Content DIV of editor
 * @param options Editor options
 */
export function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: ContentModelEditorOptions
): ContentModelCorePlugins {
    const map = options.corePluginOverride || {};

    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        ...createStandaloneEditorCorePlugins(options, contentDiv),
        edit: map.edit || createEditPlugin(),
        undo: map.undo || createUndoPlugin(options),
        imageSelection: map.imageSelection || createImageSelection(),
        normalizeTable: map.normalizeTable || createNormalizeTablePlugin(),
    };
}

/**
 * @internal
 */
export function createPluginArray(
    corePlugins: ContentModelCorePlugins,
    additionalPlugins?: EditorPlugin[]
): EditorPlugin[] {
    return [
        corePlugins.cache,
        corePlugins.format,
        corePlugins.copyPaste,
        corePlugins.domEvent,
        corePlugins.edit,
        ...(additionalPlugins ?? []),
        corePlugins.undo,
        corePlugins.entity,
        corePlugins.imageSelection,
        corePlugins.normalizeTable,
        corePlugins.lifecycle,
    ];
}

/**
 * @internal
 * Get plugin state of core plugins
 * @param corePlugins ContentModelCorePlugins object
 */
export function getPluginState(corePlugins: ContentModelCorePlugins): ContentModelPluginState {
    return {
        domEvent: corePlugins.domEvent.getState(),
        edit: corePlugins.edit.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
    };
}
