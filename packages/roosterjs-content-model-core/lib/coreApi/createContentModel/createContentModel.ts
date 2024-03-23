import {
    cloneModel,
    createDomToModelContext,
    createDomToModelContextWithConfig,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { CreateContentModel, DomToModelContext } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param core The editor core object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export const createContentModel: CreateContentModel = (
    core,
    option,
    selectionOverride,
    shadowInsertPoint
) => {
    // Flush all mutations if any, so that we can get an up-to-date Content Model
    core.cache.textMutationObserver?.flushMutations();

    let cachedModel = selectionOverride || shadowInsertPoint ? null : core.cache.cachedModel;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel, { includeCachedElement: true });
    }

    if (cachedModel) {
        return cachedModel;
    } else {
        const selection =
            selectionOverride == 'none'
                ? undefined
                : selectionOverride || core.api.getDOMSelection(core) || undefined;
        const saveIndex = !option && !selectionOverride;
        const editorContext = core.api.createEditorContext(core, saveIndex);
        const settings = core.environment.domToModelSettings;
        const domToModelContext: DomToModelContext = option
            ? createDomToModelContext(editorContext, settings.builtIn, settings.customized, option)
            : createDomToModelContextWithConfig(settings.calculated, editorContext);

        if (shadowInsertPoint) {
            domToModelContext.shadowInsertPoint = {
                input: shadowInsertPoint.input,
                path: [],
            };
        }

        const model = domToContentModel(core.logicalRoot, domToModelContext);

        if (saveIndex) {
            core.cache.cachedModel = model;
            core.cache.cachedSelection = selection;
        }

        if (domToModelContext.shadowInsertPoint && shadowInsertPoint?.result) {
            shadowInsertPoint.result = shadowInsertPoint.result;
        }

        return model;
    }
};
