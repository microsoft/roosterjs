import { updateCache } from '../../corePlugin/cache/updateCache';
import {
    contentModelToDom,
    createModelToDomContext,
    createModelToDomContextWithConfig,
} from 'roosterjs-content-model-dom';
import type { SetContentModel } from 'roosterjs-content-model-types';

/**
 * @internal
 * Set content with content model
 * @param core The editor core object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 * @param isInitializing True means editor is being initialized then it will save modification nodes onto
 * lifecycleState instead of triggering events, false means other cases
 */
export const setContentModel: SetContentModel = (
    core,
    model,
    option,
    onNodeCreated,
    isInitializing
) => {
    const editorContext = core.api.createEditorContext(core, true /*saveIndex*/);
    const modelToDomContext = option
        ? createModelToDomContext(
              editorContext,
              core.environment.modelToDomSettings.builtIn,
              core.environment.modelToDomSettings.customized,
              option
          )
        : createModelToDomContextWithConfig(
              core.environment.modelToDomSettings.calculated,
              editorContext
          );

    modelToDomContext.onNodeCreated = onNodeCreated;

    const selection = contentModelToDom(
        core.logicalRoot.ownerDocument,
        core.logicalRoot,
        model,
        modelToDomContext
    );

    if (!core.lifecycle.shadowEditFragment) {
        // Clear pending mutations since we will use our latest model object to replace existing cache
        core.cache.textMutationObserver?.flushMutations(true /*ignoreMutations*/);

        updateCache(core.cache, model, selection);

        if (!option?.ignoreSelection && selection) {
            core.api.setDOMSelection(core, selection);
        } else {
            core.selection.selection = selection;
        }
    }

    if (isInitializing) {
        // When initialize, we should not trigger event until all plugins are initialized, so put these node in lifecycle state temporarily
        core.lifecycle.domModification = modelToDomContext.domModification;
    } else {
        // Otherwise, trigger DomModification event immediately
        core.api.triggerEvent(
            core,
            {
                eventType: 'domModification',
                ...modelToDomContext.domModification,
            },
            true /*broadcast*/
        );
    }

    return selection;
};
