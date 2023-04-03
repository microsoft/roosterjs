import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { CoreCreator, EditorCore, ExperimentalFeatures } from 'roosterjs-editor-types';
import { createContentModel } from './coreApi/createContentModel';
import { createEditorContext } from './coreApi/createEditorContext';
import { createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { setContentModel } from './coreApi/setContentModel';
import { switchShadowEdit } from './coreApi/switchShadowEdit';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    ContentModelEditorCore,
    ContentModelEditorOptions
> = (contentDiv, options) => {
    const core = createEditorCore(contentDiv, options);

    return internalCreateContentModelEditorCore(core, options);
};

/**
 * Creator Content Model Editor Core from Editor Core
 * @param core The original EditorCore object
 * @param options Options of this editor
 */
export function internalCreateContentModelEditorCore(
    core: EditorCore,
    options: ContentModelEditorOptions
): ContentModelEditorCore {
    const experimentalFeatures = core.lifecycle.experimentalFeatures;
    const reuseModel = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.ReusableContentModel
    );

    return {
        ...core,
        defaultDomToModelOptions: options.defaultDomToModelOptions || {},
        defaultModelToDomOptions: options.defaultModelToDomOptions || {},
        defaultFormat: getDefaultSegmentFormat(core),
        reuseModel,
        addDelimiterForEntity: isFeatureEnabled(
            experimentalFeatures,
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        ),
        api: {
            ...core.api,
            createEditorContext,
            createContentModel,
            setContentModel,
            switchShadowEdit: reuseModel ? switchShadowEdit : core.api.switchShadowEdit, // Only use Content Model shadow edit when reuse model is enabled because it relies on cached model for the original model
        },
        originalApi: {
            ...core.originalApi,
            createEditorContext,
            createContentModel,
            setContentModel,
        },
    };
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
