import ContentModelCopyPastePlugin from './corePlugins/ContentModelCopyPastePlugin';
import { ContentModelEditorOptions } from '../publicTypes/ContentModelEditorOptions';
import { ContentModelEditorPlugin } from '../publicTypes/ContentModelEditorPlugin';
import { coreApiMap } from './coreApiMap';
import { createContentModelCachePlugin } from './corePlugins/ContentModelCachePlugin';
import { createContentModelEditPlugin } from './corePlugins/ContentModelEditPlugin';
import { createContentModelFormatPlugin } from './corePlugins/ContentModelFormatPlugin';
import { DomToModelOption, ModelToDomOption } from 'roosterjs-content-model-types/lib';
import { tablePreProcessor } from './overrides/tablePreProcessor';
import {
    ContentModelCorePlugins,
    ContentModelPluginState,
} from '../publicTypes/ContentModelCorePlugins';
import {
    createDomToModelConfig,
    createModelToDomConfig,
    getObjectKeys,
} from 'roosterjs-content-model-dom';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../domUtils/metadata/updateListMetadata';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';

/**
 * Editor Core creator for Content Model editor
 */
export function createContentModelEditorCore(
    contentDiv: HTMLDivElement,
    options: ContentModelEditorOptions
): ContentModelEditorCore {
    const corePlugins = createContentModelCorePlugins(options);
    const plugins: ContentModelEditorPlugin[] = [];

    getObjectKeys(corePlugins).forEach(name => {
        if (name == '_placeholder') {
            if (options.plugins) {
                plugins.push(...options.plugins);
            }
        } else {
            plugins.push(corePlugins[name]);
        }
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
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: coreApiMap,
        plugins: plugins.filter(x => !!x),
        ...pluginState,
        trustedHTMLHandler: options.trustedHTMLHandler || ((html: string) => html),
        darkColorHandler: null!, // new DarkColorHandlerImpl(contentDiv, pluginState.lifecycle.getDarkColor),
        disposeErrorHandler: options.disposeErrorHandler,
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

interface CreateCorePluginResponse extends ContentModelCorePlugins {
    _placeholder: null;
}

function createContentModelCorePlugins(
    options: ContentModelEditorOptions
): CreateCorePluginResponse {
    return {
        cache: createContentModelCachePlugin(),
        _placeholder: null,
        format: createContentModelFormatPlugin(options),
        edit: createContentModelEditPlugin(),
        undo: null!,
        domEvent: null!,
        copyPaste: new ContentModelCopyPastePlugin(),
        entity: null!,
        selection: null!,
        lifecycle: null!,
    };
}

function getPluginState(plugins: ContentModelCorePlugins): ContentModelPluginState {
    return {
        cache: plugins.cache.getState(),
        format: plugins.format.getState(),
        lifecycle: plugins.lifecycle.getState(),
    };
}
