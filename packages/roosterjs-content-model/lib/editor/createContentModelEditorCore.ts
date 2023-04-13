import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { CoreCreator, EditorCore, ExperimentalFeatures } from 'roosterjs-editor-types';
import { createContentModel } from './coreApi/createContentModel';
import { createEditorContext } from './coreApi/createEditorContext';
import { createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { createPasteFragment } from './coreApi/createPasteFragment';
import { setContentModel } from './coreApi/setContentModel';
import { switchShadowEdit } from './coreApi/switchShadowEdit';

/**
 * Editor Core creator for Content Model editor
 */
export const createContentModelEditorCore: CoreCreator<
    ContentModelEditorCore,
    ContentModelEditorOptions
> = (contentDiv, options) => {
    const core = createEditorCore(contentDiv, options) as ContentModelEditorCore;

    promoteToContentModelEditorCore(core, options);

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
    const experimentalFeatures = core.lifecycle.experimentalFeatures;
    const reuseModel = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.ReusableContentModel
    );
    const cmCore = core as ContentModelEditorCore;

    cmCore.defaultDomToModelOptions = options.defaultDomToModelOptions || {};
    cmCore.defaultModelToDomOptions = options.defaultModelToDomOptions || {};
    cmCore.defaultFormat = getDefaultSegmentFormat(core);
    cmCore.reuseModel = reuseModel;
    (cmCore.addDelimiterForEntity = isFeatureEnabled(
        experimentalFeatures,
        ExperimentalFeatures.InlineEntityReadOnlyDelimiters
    )),
        (cmCore.api.createEditorContext = createEditorContext);
    cmCore.api.createContentModel = createContentModel;
    cmCore.api.setContentModel = setContentModel;

    if (reuseModel) {
        // Only use Content Model shadow edit when reuse model is enabled because it relies on cached model for the original model
        cmCore.api.switchShadowEdit = switchShadowEdit;
    }
    cmCore.originalApi.createEditorContext = createEditorContext;
    cmCore.originalApi.createContentModel = createContentModel;
    cmCore.originalApi.setContentModel = setContentModel;
    cmCore.api.createPasteFragment = createPasteFragment;
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
