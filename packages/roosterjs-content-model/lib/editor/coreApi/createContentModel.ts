import domToContentModel from '../../domToModel/domToContentModel';
import { cloneModel } from '../../modelApi/common/cloneModel';
import { DomToModelOption } from '../../publicTypes/IContentModelEditor';
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
export const createContentModel: CreateContentModel = (core, option) => {
    let cachedModel = core.reuseModel ? core.cachedModel : null;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel);
    }

    return cachedModel || internalCreateContentModel(core, option);
};

function internalCreateContentModel(
    core: ContentModelEditorCore,
    option: DomToModelOption | undefined
) {
    const context: DomToModelOption = {
        selectionRange: core.api.getSelectionRangeEx(core),
        ...core.defaultDomToModelOptions,
        ...(option || {}),
        processorOverride: {
            table: tablePreProcessor,
            ...(option?.processorOverride || {}),
        },
    };

    if (!core.reuseModel) {
        context.disableCacheElement = true;
    }

    return domToContentModel(core.contentDiv, core.api.createEditorContext(core), context);
}
