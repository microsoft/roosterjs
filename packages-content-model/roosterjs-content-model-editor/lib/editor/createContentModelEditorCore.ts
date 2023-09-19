import ContentModelCopyPastePlugin from './corePlugins/ContentModelCopyPastePlugin';
import ContentModelEditPlugin from './plugins/ContentModelEditPlugin';
import ContentModelFormatPlugin from './plugins/ContentModelFormatPlugin';
import ContentModelTypeInContainerPlugin from './corePlugins/ContentModelTypeInContainerPlugin';
import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { CoreCreator, EditorCore, ExperimentalFeatures } from 'roosterjs-editor-types';
import { createContentModel } from './coreApi/createContentModel';
import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import { createEditorContext } from './coreApi/createEditorContext';
import { createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { getSelectionRangeEx } from './coreApi/getSelectionRangeEx';
import { setContentModel } from './coreApi/setContentModel';
import { switchShadowEdit } from './coreApi/switchShadowEdit';
import { tablePreProcessor } from './overrides/tablePreProcessor';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    ContentModelEditorCore,
    ContentModelEditorOptions
> = (contentDiv, options) => {
    const modifiedOptions: ContentModelEditorOptions = {
        ...options,
        plugins: [
            ...(options.plugins || []),
            new ContentModelFormatPlugin(),
            new ContentModelEditPlugin(),
        ],
        corePluginOverride: {
            typeInContainer: new ContentModelTypeInContainerPlugin(),
            copyPaste: isFeatureEnabled(
                options.experimentalFeatures,
                ExperimentalFeatures.ContentModelPaste
            )
                ? new ContentModelCopyPastePlugin({
                      allowedCustomPasteType: options.allowedCustomPasteType || [],
                  })
                : undefined,
            ...(options.corePluginOverride || {}),
        },
    };

    const core = createEditorCore(contentDiv, modifiedOptions) as ContentModelEditorCore;

    promoteToContentModelEditorCore(core, modifiedOptions);

    return core;
};

/**
 * Creator Content Model Editor Core from Editor Core
 * @param core The original EditorCore object
 * @param options Options of this editor
 */
export function promoteToContentModelEditorCore(
    core: EditorCore,
    options: ContentModelEditorOptions
) {
    const cmCore = core as ContentModelEditorCore;

    promoteDefaultFormat(cmCore);
    promoteContentModelInfo(cmCore, options);
    promoteCoreApi(cmCore);
}

function promoteDefaultFormat(cmCore: ContentModelEditorCore) {
    cmCore.lifecycle.defaultFormat = cmCore.lifecycle.defaultFormat || {};
    cmCore.defaultFormat = getDefaultSegmentFormat(cmCore);
}

function promoteContentModelInfo(
    cmCore: ContentModelEditorCore,
    options: ContentModelEditorOptions
) {
    const experimentalFeatures = cmCore.lifecycle.experimentalFeatures;

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

    cmCore.addDelimiterForEntity = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.InlineEntityReadOnlyDelimiters
    );
}

function promoteCoreApi(cmCore: ContentModelEditorCore) {
    cmCore.api.createEditorContext = createEditorContext;
    cmCore.api.createContentModel = createContentModel;
    cmCore.api.setContentModel = setContentModel;
    cmCore.api.switchShadowEdit = switchShadowEdit;
    cmCore.api.getSelectionRangeEx = getSelectionRangeEx;
    cmCore.originalApi.createEditorContext = createEditorContext;
    cmCore.originalApi.createContentModel = createContentModel;
    cmCore.originalApi.setContentModel = setContentModel;
}

function getDefaultSegmentFormat(core: EditorCore): ContentModelSegmentFormat {
    const format = core.lifecycle.defaultFormat ?? {};

    return {
        fontWeight: format.bold ? 'bold' : undefined,
        italic: format.italic || undefined,
        underline: format.underline || undefined,
        fontFamily: format.fontFamily || undefined,
        fontSize: format.fontSize || undefined,
        textColor: format.textColors?.lightModeColor || format.textColor || undefined,
        backgroundColor:
            format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
    };
}
