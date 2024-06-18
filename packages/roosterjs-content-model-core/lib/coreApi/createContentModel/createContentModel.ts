import { updateCache } from '../../corePlugin/cache/updateCache';
import {
    cloneModel,
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
    // Flush all mutations if any, so that we can get an up-to-date Content Model
    core.cache.textMutationObserver?.flushMutations();

    if (!selectionOverride && (!option || option.tryGetFromCache)) {
        const cachedModel = core.cache.cachedModel;

        if (cachedModel) {
            // When in shadow edit, use a cloned model so we won't pollute the cached one
            return core.lifecycle.shadowEditFragment
                ? cloneModel(cachedModel, { includeCachedElement: true })
                : cachedModel;
        }
    }

    const selection =
        selectionOverride == 'none'
            ? undefined
            : selectionOverride || core.api.getDOMSelection(core) || undefined;
    const saveIndex = !option && !selectionOverride;
    const editorContext = core.api.createEditorContext(core, saveIndex);
    const settings = core.environment.domToModelSettings;
    const domToModelContext = option
        ? createDomToModelContext(editorContext, settings.builtIn, settings.customized, option)
        : createDomToModelContextWithConfig(settings.calculated, editorContext);

    if (selection) {
        domToModelContext.selection = selection;
    }

    const model = domToContentModel(core.logicalRoot, domToModelContext);

    if (saveIndex) {
        updateCache(core.cache, model, selection);
    }

    return model;
};
