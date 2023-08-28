import { cloneModel } from '../../modelApi/common/cloneModel';
import { createOnNewTextSegmentCallbacks } from '../utils/modelCache';
import { domToContentModel } from 'roosterjs-content-model-dom';
import { DomToModelOption, EditorContext } from 'roosterjs-content-model-types';
import { reducedModelChildProcessor } from '../../publicApi/format/getFormatState';
import { tablePreProcessor } from '../../domToModel/processors/tablePreProcessor';
import {
    ContentModelEditorCore,
    CreateContentModel,
    CreateContentModelOptions,
} from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export const createContentModel: CreateContentModel = (core, option) => {
    const allowCache =
        !core.lifecycle.shadowEditEntities && !option.selectionOverride && !option.useReducedModel;
    let result = allowCache ? core.cachedModel : null;

    if (result && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        result = cloneModel(result, { includeCachedElement: true });
    }

    if (!result) {
        const editorContext = core.api.createEditorContext(core);

        result = internalCreateContentModel(core, editorContext, option);

        if (allowCache) {
            core.cachedModel = result;
        }
    }

    return result;
};

function internalCreateContentModel(
    core: ContentModelEditorCore,
    editorContext: EditorContext,
    option: CreateContentModelOptions
) {
    const domToModelOption: DomToModelOption = {
        callbacks: createOnNewTextSegmentCallbacks(core.cache),
        ...core.defaultDomToModelOptions,
    };
    const range = option.selectionOverride || core.api.getSelectionRangeEx(core);

    domToModelOption.processorOverride = {
        table: tablePreProcessor,
        ...domToModelOption.processorOverride,
    };

    if (option.useReducedModel) {
        domToModelOption.processorOverride.child = reducedModelChildProcessor;
    }

    core.contentDiv.normalize();
    core.cache.cachedRangeEx = range;

    return domToContentModel(core.contentDiv, domToModelOption, editorContext, range);
}
