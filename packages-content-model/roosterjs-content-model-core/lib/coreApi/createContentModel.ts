import { cloneModel } from '../publicApi/model/cloneModel';
import {
    createDomToModelContext,
    createDomToModelContextWithConfig,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { CreateContentModel } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param core The editor core object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export const createContentModel: CreateContentModel = (core, option, selectionOverride) => {
    let cachedModel = selectionOverride ? null : core.cache.cachedModel;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel, { includeCachedElement: true });
    }

    if (cachedModel) {
        return cachedModel;
    } else {
        const selection = selectionOverride || core.api.getDOMSelection(core) || undefined;
        const saveIndex = !option && !selectionOverride;
        const editorContext = core.api.createEditorContext(core, saveIndex);
        const domToModelContext = option
            ? createDomToModelContext(
                  editorContext,
                  core.domToModelSettings.builtIn,
                  core.domToModelSettings.customized,
                  option
              )
            : createDomToModelContextWithConfig(core.domToModelSettings.calculated, editorContext);

        const model = domToContentModel(core.contentDiv, domToModelContext, selection);

        if (saveIndex) {
            core.cache.cachedModel = model;
            core.cache.cachedSelection = selection;
        }

        return model;
    }
};
