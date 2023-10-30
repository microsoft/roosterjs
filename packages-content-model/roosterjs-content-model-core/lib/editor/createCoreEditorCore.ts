import ColorManagerImpl from './ColorManagerImpl';
import { coreApiMap } from '../coreApi/coreApiMap';
import { createCorePlugins } from './createCorePlugins';
import type { CoreEditorCorePlugins } from '../publicTypes/editor/CoreEditorCorePlugins';
import type { CoreEditorPlugin } from '../publicTypes/editor/CoreEditorPlugin';
import type { CoreEditorPluginState } from '../publicTypes/editor/CoreEditorPluginState';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
    tablePreProcessor,
} from 'roosterjs-content-model-editor';
import {
    createDomToModelConfig,
    createModelToDomConfig,
    getObjectKeys,
} from 'roosterjs-content-model-dom';
import type {
    CoreEditorOptions,
    DomToModelOption,
    EditorEnvironment,
    ModelToDomOption,
} from 'roosterjs-content-model-types';
import type { CoreEditorCore } from '../publicTypes/editor/CoreEditorCore';

/**
 * @internal
 */
export function createCoreEditorCore(
    contentDiv: HTMLDivElement,
    options: CoreEditorOptions
): CoreEditorCore {
    const corePlugins = createCorePlugins(contentDiv, options);
    const plugins: CoreEditorPlugin[] = [];

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
    const environment: EditorEnvironment = {
        isMac: window.navigator.appVersion.indexOf('Mac') != -1,
        isAndroid: /android/i.test(window.navigator.userAgent),
    };

    const core: CoreEditorCore = {
        contentDiv,
        plugins: plugins.filter(x => !!x),
        api: coreApiMap,
        ...pluginState,
        defaultDomToModelOptions,
        defaultModelToDomOptions,
        defaultDomToModelConfig: createDomToModelConfig(defaultDomToModelOptions),
        defaultModelToDomConfig: createModelToDomConfig(defaultModelToDomOptions),
        environment,
        colorManager: new ColorManagerImpl(contentDiv, pluginState.lifecycle.getDarkColor),
    };

    return core;
}

function getPluginState(corePlugins: CoreEditorCorePlugins): CoreEditorPluginState {
    return {
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        selection: corePlugins.selection.getState(),
    };
}
