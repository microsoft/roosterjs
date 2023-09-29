import ContentModelCopyPastePlugin from './corePlugins/ContentModelCopyPastePlugin';
import ContentModelTypeInContainerPlugin from './corePlugins/ContentModelTypeInContainerPlugin';
import { contentModelDomIndexer } from './utils/contentModelDomIndexer';
import { createContentModel } from './coreApi/createContentModel';
import { createContentModelCachePlugin } from './corePlugins/ContentModelCachePlugin';
import { createContentModelEditPlugin } from './corePlugins/ContentModelEditPlugin';
import { createContentModelFormatPlugin } from './corePlugins/ContentModelFormatPlugin';
import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import { createEditorContext } from './coreApi/createEditorContext';
import { createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { getDOMSelection } from './coreApi/getDOMSelection';
import { setContentModel } from './coreApi/setContentModel';
import { setDOMSelection } from './coreApi/setDOMSelection';
import { switchShadowEdit } from './coreApi/switchShadowEdit';
import { tablePreProcessor } from './overrides/tablePreProcessor';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { ContentModelPluginState } from '../publicTypes/pluginState/ContentModelPluginState';
import type { CoreCreator, EditorCore } from 'roosterjs-editor-types';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    ContentModelEditorCore,
    ContentModelEditorOptions
> = (contentDiv, options) => {
    const pluginState = getPluginState(options);
    const modifiedOptions: ContentModelEditorOptions = {
        ...options,
        plugins: [
            createContentModelCachePlugin(pluginState.cache),
            ...(options.plugins || []),
            createContentModelFormatPlugin(pluginState.format),
            createContentModelEditPlugin(),
        ],
        corePluginOverride: {
            typeInContainer: new ContentModelTypeInContainerPlugin(),
            copyPaste: new ContentModelCopyPastePlugin(pluginState.copyPaste),
            ...options.corePluginOverride,
        },
    };

    const core = createEditorCore(contentDiv, modifiedOptions) as ContentModelEditorCore;

    promoteToContentModelEditorCore(core, modifiedOptions, pluginState);

    return core;
};

/**
 * Creator Content Model Editor Core from Editor Core
 * @param core The original EditorCore object
 * @param options Options of this editor
 */
export function promoteToContentModelEditorCore(
    core: EditorCore,
    options: ContentModelEditorOptions,
    pluginState: ContentModelPluginState
) {
    const cmCore = core as ContentModelEditorCore;

    promoteCorePluginState(cmCore, pluginState);
    promoteContentModelInfo(cmCore, options);
    promoteCoreApi(cmCore);
}

function promoteCorePluginState(
    cmCore: ContentModelEditorCore,
    pluginState: ContentModelPluginState
) {
    Object.assign(cmCore, pluginState);
}

function promoteContentModelInfo(
    cmCore: ContentModelEditorCore,
    options: ContentModelEditorOptions
) {
    cmCore.defaultDomToModelOptions = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    cmCore.defaultModelToDomOptions = [options.defaultModelToDomOptions];
    cmCore.defaultDomToModelConfig = createDomToModelConfig(cmCore.defaultDomToModelOptions);
    cmCore.defaultModelToDomConfig = createModelToDomConfig(cmCore.defaultModelToDomOptions);
}

function promoteCoreApi(cmCore: ContentModelEditorCore) {
    cmCore.api.createEditorContext = createEditorContext;
    cmCore.api.createContentModel = createContentModel;
    cmCore.api.setContentModel = setContentModel;
    cmCore.api.switchShadowEdit = switchShadowEdit;
    cmCore.api.getDOMSelection = getDOMSelection;
    cmCore.api.setDOMSelection = setDOMSelection;
    cmCore.originalApi.createEditorContext = createEditorContext;
    cmCore.originalApi.createContentModel = createContentModel;
    cmCore.originalApi.setContentModel = setContentModel;
    cmCore.originalApi.getDOMSelection = getDOMSelection;
    cmCore.originalApi.setDOMSelection = setDOMSelection;
}

function getPluginState(options: ContentModelEditorOptions): ContentModelPluginState {
    const format = options.defaultFormat || {};
    return {
        cache: {
            domIndexer: isFeatureEnabled(
                options.experimentalFeatures,
                ExperimentalFeatures.ReusableContentModelV2
            )
                ? contentModelDomIndexer
                : undefined,
        },
        copyPaste: {
            allowedCustomPasteType: options.allowedCustomPasteType || [],
        },
        format: {
            defaultFormat: {
                fontWeight: format.bold ? 'bold' : undefined,
                italic: format.italic || undefined,
                underline: format.underline || undefined,
                fontFamily: format.fontFamily || undefined,
                fontSize: format.fontSize || undefined,
                textColor: format.textColors?.lightModeColor || format.textColor || undefined,
                backgroundColor:
                    format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
            },
        },
    };
}
