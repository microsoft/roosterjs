import { coreApiMap } from '../coreApi/coreApiMap';
import { createContentModelCachePlugin } from '../corePlugins/ContentModelCachePlugin';
import { createContentModelFormatPlugin } from '../corePlugins/ContentModelFormatPlugin';
import { createContentModelLifecyclePlugin } from '../corePlugins/ContentModelLifecyclePlugin';
import { createContentModelSelectionPlugin } from '../corePlugins/ContentModelSelectionPlugin';
import { DarkColorHandlerImpl } from './DarkColorHandlerImpl';
import { listItemMetadataApplier, listLevelMetadataApplier } from '../metadata/updateListMetadata';
import { tablePreProcessor } from './processOverrides/tablePreProcessor';
import type { CorePlugins } from '../publicTypes/plugin/CorePlugins';
import type { EditorCore } from '../publicTypes/editor/EditorCore';
import type { EditorOptions } from '../publicTypes/editor/EditorOptions';
import type { EditorPlugin } from '../publicTypes/plugin/EditorPlugin';
import type { PluginState } from '../publicTypes/plugin/PluginState';
import type { DomToModelOption, ModelToDomOption } from 'roosterjs-content-model-types';
import {
    createDomToModelConfig,
    createModelToDomConfig,
    getObjectKeys,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function createContentModelEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    const corePlugins = createContentModelCorePlugins(options);
    const plugins: EditorPlugin[] = [];

    getObjectKeys(corePlugins).forEach(name => {
        plugins.push(corePlugins[name]);
    });

    const pluginState = getPluginState(corePlugins);
    const defaultDomToModelOptions: (DomToModelOption | undefined)[] = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    const defaultModelToDomOptions: (ModelToDomOption | undefined)[] = [
        {
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
            },
        },
        options.defaultModelToDomOptions,
    ];
    const core: EditorCore = {
        contentDiv,
        ...pluginState,
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: coreApiMap,
        plugins: plugins.filter(x => !!x),
        environment: {
            isMac: window.navigator.appVersion.indexOf('Mac') != -1,
        },
        defaultDomToModelOptions,
        defaultModelToDomOptions,
        defaultDomToModelConfig: createDomToModelConfig(defaultDomToModelOptions),
        defaultModelToDomConfig: createModelToDomConfig(defaultModelToDomOptions),
        colorManager: new DarkColorHandlerImpl(contentDiv, color => color),
    };

    return core;
}

function createContentModelCorePlugins(options: EditorOptions): CorePlugins {
    return {
        cache: createContentModelCachePlugin(options),
        format: createContentModelFormatPlugin(options),
        selection: createContentModelSelectionPlugin(),
        lifecycle: createContentModelLifecyclePlugin(),
    };
}

function getPluginState(plugins: CorePlugins): PluginState {
    return {
        cache: plugins.cache.getState(),
        format: plugins.format.getState(),
        lifecycle: plugins.lifecycle.getState(),
        selection: plugins.selection.getState(),
    };
}
