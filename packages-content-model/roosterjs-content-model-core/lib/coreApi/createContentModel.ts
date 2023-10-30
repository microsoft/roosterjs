import { cloneModel } from 'roosterjs-content-model-editor';
import type { CoreEditorCore } from '../publicTypes/editor/CoreEditorCore';
import type { CreateContentModel } from '../publicTypes/coreApi/CreateContentModel';
import type { DOMSelection, DomToModelOption } from 'roosterjs-content-model-types';
import {
    createDomToModelContext,
    createDomToModelContextWithConfig,
    domToContentModel,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param core The editor core object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export const createContentModel: CreateContentModel = (core, option, selectionOverride) => {
    let cachedModel = selectionOverride ? null : core.cache.cachedModel;

    if (cachedModel && core.lifecycle.isInShadowEdit) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel, { includeCachedElement: true });
    }

    if (cachedModel) {
        return cachedModel;
    } else {
        const selection =
            selectionOverride ||
            core.api.getDOMSelection(core, false /*forceGetNewSelection*/) ||
            undefined;
        const model = internalCreateContentModel(core, selection, option);

        if (!option && !selectionOverride) {
            core.cache.cachedModel = model;
            core.cache.cachedSelection = selection;
        }

        return model;
    }
};

function internalCreateContentModel(
    core: CoreEditorCore,
    selection?: DOMSelection,
    option?: DomToModelOption
) {
    const editorContext = core.api.createEditorContext(core);
    const domToModelContext = option
        ? createDomToModelContext(editorContext, ...(core.defaultDomToModelOptions || []), option)
        : createDomToModelContextWithConfig(core.defaultDomToModelConfig, editorContext);

    return domToContentModel(core.contentDiv, domToModelContext, selection);
}
