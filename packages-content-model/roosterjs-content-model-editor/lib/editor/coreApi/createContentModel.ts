import { cloneModel } from '../../modelApi/common/cloneModel';
import { DomToModelOption } from 'roosterjs-content-model-types';
import { SelectionRangeEx } from 'roosterjs-editor-types';
import {
    createDomToModelContext,
    createDomToModelContextWithConfig,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import {
    ContentModelEditorCore,
    CreateContentModel,
} from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param core The editor core object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export const createContentModel: CreateContentModel = (core, option, selectionOverride) => {
    let cachedModel = selectionOverride ? null : core.contentModelEdit.cachedModel;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel, { includeCachedElement: true });
    }

    if (cachedModel) {
        return cachedModel;
    } else {
        const model = internalCreateContentModel(core, option, selectionOverride);

        if (!option && !selectionOverride) {
            core.contentModelEdit.cachedModel = model;
        }

        return model;
    }
};

function internalCreateContentModel(
    core: ContentModelEditorCore,
    option?: DomToModelOption,
    selectionOverride?: SelectionRangeEx
) {
    const editorContext = core.api.createEditorContext(core);
    const domToModelContext = option
        ? createDomToModelContext(editorContext, ...(core.defaultDomToModelOptions || []), option)
        : createDomToModelContextWithConfig(core.defaultDomToModelConfig, editorContext);

    return domToContentModel(
        core.contentDiv,
        domToModelContext,
        selectionOverride || core.api.getSelectionRangeEx(core)
    );
}
