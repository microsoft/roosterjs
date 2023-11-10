import { createContentModel } from '../coreApi/createContentModel';
import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import { createEditorContext } from '../coreApi/createEditorContext';
import { formatContentModel } from '../coreApi/formatContentModel';
import { getDOMSelection } from '../coreApi/getDOMSelection';
import { listItemMetadataApplier, listLevelMetadataApplier } from '../metadata/updateListMetadata';
import { setContentModel } from '../coreApi/setContentModel';
import { setDOMSelection } from '../coreApi/setDOMSelection';
import { switchShadowEdit } from '../coreApi/switchShadowEdit';
import { tablePreProcessor } from '../override/tablePreProcessor';
import type {
    ContentModelPluginState,
    StandaloneEditorCore,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';
import type { EditorCore, EditorOptions } from 'roosterjs-editor-types';

/**
 * Creator Content Model Editor Core from Editor Core
 * @param core The original EditorCore object
 * @param options Options of this editor
 */
export function promoteToContentModelEditorCore(
    core: EditorCore,
    options: EditorOptions & StandaloneEditorOptions,
    pluginState: ContentModelPluginState
) {
    const cmCore = core as EditorCore & StandaloneEditorCore;

    promoteCorePluginState(cmCore, pluginState);
    promoteContentModelInfo(cmCore, options);
    promoteCoreApi(cmCore);
    promoteEnvironment(cmCore);
}

function promoteCorePluginState(
    cmCore: StandaloneEditorCore,
    pluginState: ContentModelPluginState
) {
    Object.assign(cmCore, pluginState);
}

function promoteContentModelInfo(cmCore: StandaloneEditorCore, options: StandaloneEditorOptions) {
    cmCore.defaultDomToModelOptions = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    cmCore.defaultModelToDomOptions = [
        {
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
            },
        },
        options.defaultModelToDomOptions,
    ];
    cmCore.defaultDomToModelConfig = createDomToModelConfig(cmCore.defaultDomToModelOptions);
    cmCore.defaultModelToDomConfig = createModelToDomConfig(cmCore.defaultModelToDomOptions);
}

function promoteCoreApi(cmCore: StandaloneEditorCore) {
    cmCore.api.createEditorContext = createEditorContext;
    cmCore.api.createContentModel = createContentModel;
    cmCore.api.setContentModel = setContentModel;
    cmCore.api.switchShadowEdit = switchShadowEdit;
    cmCore.api.getDOMSelection = getDOMSelection;
    cmCore.api.setDOMSelection = setDOMSelection;
    cmCore.api.formatContentModel = formatContentModel;
    cmCore.originalApi.createEditorContext = createEditorContext;
    cmCore.originalApi.createContentModel = createContentModel;
    cmCore.originalApi.setContentModel = setContentModel;
    cmCore.originalApi.getDOMSelection = getDOMSelection;
    cmCore.originalApi.setDOMSelection = setDOMSelection;
    cmCore.originalApi.formatContentModel = formatContentModel;
}

function promoteEnvironment(cmCore: StandaloneEditorCore) {
    cmCore.environment = {};

    // It is ok to use global window here since the environment should always be the same for all windows in one session
    cmCore.environment.isMac = window.navigator.appVersion.indexOf('Mac') != -1;
    cmCore.environment.isAndroid = /android/i.test(window.navigator.userAgent);
}
