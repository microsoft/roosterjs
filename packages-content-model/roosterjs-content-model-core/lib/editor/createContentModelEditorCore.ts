import { coreApiMap } from './coreApiMap';
import { createContentModelCachePlugin } from '../corePlugins/ContentModelCachePlugin';
import { createContentModelEditPlugin } from '../corePlugins/ContentModelEditPlugin';
import { createContentModelFormatPlugin } from '../corePlugins/ContentModelFormatPlugin';
import { listItemMetadataApplier, listLevelMetadataApplier } from '../metadata/updateListMetadata';
import { tablePreProcessor } from './processOverrides/tablePreProcessor';
import type { ContentModelCorePlugins } from '../publicTypes/plugin/ContentModelCorePlugins';
import type { ContentModelEditorCore } from '../publicTypes/editor/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/editor/ContentModelEditorOptions';
import type { ContentModelEditorPlugin } from '../publicTypes/plugin/ContentModelEditorPlugin';
import type { ContentModelPluginState } from '../publicTypes/plugin/ContentModelPluginState';
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
    options: ContentModelEditorOptions
): ContentModelEditorCore {
    const corePlugins = createContentModelCorePlugins(options);
    const plugins: ContentModelEditorPlugin[] = [];

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
    const core: ContentModelEditorCore = {
        contentDiv,
        pluginState,
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
    };

    return core;
}

function createContentModelCorePlugins(
    options: ContentModelEditorOptions
): ContentModelCorePlugins {
    return {
        cache: createContentModelCachePlugin(options),
        format: createContentModelFormatPlugin(options),
        edit: createContentModelEditPlugin(),
    };
}

function getPluginState(plugins: ContentModelCorePlugins): ContentModelPluginState {
    return {
        cache: plugins.cache.getState(),
        format: plugins.format.getState(),
    };
}
