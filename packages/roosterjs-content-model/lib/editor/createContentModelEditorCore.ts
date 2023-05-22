import ContentModelEditPlugin from './plugins/ContentModelEditPlugin';
import ContentModelFormatPlugin from './plugins/ContentModelFormatPlugin';
import ContentModelTypeInContainerPlugin from './corePlugins/ContentModelTypeInContainerPlugin';
import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { createContentModel } from './coreApi/createContentModel';
import { createEditorContext } from './coreApi/createEditorContext';
import { createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { createPasteModel } from './coreApi/createPasteModel';
import { setContentModel } from './coreApi/setContentModel';
import { switchShadowEdit } from './coreApi/switchShadowEdit';
import ContentModelCopyPastePlugin from './corePlugins/ContentModelCopyPastePlugin';
import {
    CoreCreator,
    DefaultFormat,
    EditorCore,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';

const DEFAULT_FORMAT: DefaultFormat = {
    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
    fontSize: '12pt',
};

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
            copyPaste: new ContentModelCopyPastePlugin(options),
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
    cmCore.defaultFormatOnContainer = isFeatureEnabled(
        cmCore.lifecycle.experimentalFeatures,
        ExperimentalFeatures.DefaultFormatOnContainer
    );
    cmCore.lifecycle.defaultFormat = {
        ...(cmCore.defaultFormatOnContainer ? DEFAULT_FORMAT : {}),
        ...(cmCore.lifecycle.defaultFormat || {}),
    };
    cmCore.defaultFormat = getDefaultSegmentFormat(cmCore);
    cmCore.originalContainerFormat = {};

    if (cmCore.defaultFormatOnContainer) {
        const { contentDiv, defaultFormat } = cmCore;
        const { fontFamily, fontSize } = defaultFormat;

        cmCore.originalContainerFormat.fontFamily = contentDiv.style.fontFamily;
        cmCore.originalContainerFormat.fontSize = contentDiv.style.fontSize;

        if (fontFamily) {
            contentDiv.style.fontFamily = fontFamily;
        }

        if (fontSize) {
            contentDiv.style.fontSize = fontSize;
        }
    }
}

function promoteContentModelInfo(
    cmCore: ContentModelEditorCore,
    options: ContentModelEditorOptions
) {
    const experimentalFeatures = cmCore.lifecycle.experimentalFeatures;

    cmCore.defaultDomToModelOptions = options.defaultDomToModelOptions || {};
    cmCore.defaultModelToDomOptions = options.defaultModelToDomOptions || {};
    cmCore.reuseModel = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.ReusableContentModel
    );
    cmCore.addDelimiterForEntity = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.InlineEntityReadOnlyDelimiters
    );
}

function promoteCoreApi(cmCore: ContentModelEditorCore) {
    cmCore.api.createEditorContext = createEditorContext;
    cmCore.api.createContentModel = createContentModel;
    cmCore.api.setContentModel = setContentModel;
    cmCore.api.createPasteModel = createPasteModel;

    if (
        isFeatureEnabled(
            cmCore.lifecycle.experimentalFeatures,
            ExperimentalFeatures.ReusableContentModel
        )
    ) {
        // Only use Content Model shadow edit when reuse model is enabled because it relies on cached model for the original model
        cmCore.api.switchShadowEdit = switchShadowEdit;
    }
    cmCore.originalApi.createEditorContext = createEditorContext;
    cmCore.originalApi.createContentModel = createContentModel;
    cmCore.originalApi.setContentModel = setContentModel;
    cmCore.originalApi.createPasteModel = createPasteModel;
}

function getDefaultSegmentFormat(core: EditorCore): ContentModelSegmentFormat {
    const format = core.lifecycle.defaultFormat ?? {};

    return {
        fontWeight: format.bold ? 'bold' : undefined,
        italic: format.italic || undefined,
        underline: format.underline || undefined,
        fontFamily: format.fontFamily || DEFAULT_FORMAT.fontFamily,
        fontSize: format.fontSize || DEFAULT_FORMAT.fontSize,
        textColor:
            format.textColors?.lightModeColor || format.textColor || DEFAULT_FORMAT.textColor,
        backgroundColor:
            format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
    };
}
