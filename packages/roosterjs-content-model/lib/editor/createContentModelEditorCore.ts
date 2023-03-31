import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { CoreCreator, createEditorCore, isFeatureEnabled } from 'roosterjs-editor-core';
import { createContentModel } from './coreApi/createContentModel';
import { createEditorContext } from './coreApi/createEditorContext';
import { EditorCore, ExperimentalFeatures } from 'roosterjs-editor-types';
import { setContentModel } from './coreApi/setContentModel';

/**
 * @internal
 */
export const createContentModelEditorCore: CoreCreator<ContentModelEditorCore> = (
    contentDiv,
    editorOptions
) => {
    const options = editorOptions as ContentModelEditorOptions;
    const core = createEditorCore(contentDiv, options);
    const experimentalFeatures = core.lifecycle.experimentalFeatures;

    return {
        ...core,
        defaultDomToModelOptions: options.defaultDomToModelOptions || {},
        defaultModelToDomOptions: options.defaultModelToDomOptions || {},
        defaultFormat: getDefaultSegmentFormat(core),
        reuseModel: isFeatureEnabled(
            experimentalFeatures,
            ExperimentalFeatures.ReusableContentModel
        ),
        addDelimiterForEntity: isFeatureEnabled(
            experimentalFeatures,
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        ),
        api: {
            ...core.api,
            createEditorContext,
            createContentModel,
            setContentModel,
        },
        originalApi: {
            ...core.originalApi,
            createEditorContext,
            createContentModel,
            setContentModel,
        },
    };
};

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
