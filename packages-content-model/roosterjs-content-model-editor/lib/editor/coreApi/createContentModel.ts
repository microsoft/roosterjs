import { cloneModel } from '../../modelApi/common/cloneModel';
import { domToContentModel } from 'roosterjs-content-model-dom';
import { DomToModelOption } from 'roosterjs-content-model-types';
import { SelectionRangeEx } from 'roosterjs-editor-types';
import { tablePreProcessor } from '../../domToModel/processors/tablePreProcessor';
import {
    ContentModelEditorCore,
    CreateContentModel,
} from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export const createContentModel: CreateContentModel = (core, option, selectionOverride) => {
    let cachedModel = selectionOverride ? null : core.cachedModel;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel);
    }

    return cachedModel || internalCreateContentModel(core, option, selectionOverride);
};

function internalCreateContentModel(
    core: ContentModelEditorCore,
    option: DomToModelOption | undefined,
    selectionOverride?: SelectionRangeEx
) {
    const context: DomToModelOption = {
        ...core.defaultDomToModelOptions,
        ...option,
    };

    context.processorOverride = {
        table: tablePreProcessor,
        ...context.processorOverride,
        ...option?.processorOverride,
    };

    return domToContentModel(
        core.contentDiv,
        context,
        core.api.createEditorContext(core),
        selectionOverride || core.api.getSelectionRangeEx(core)
    );
}
