import { updateCache } from '../../corePlugin/cache/updateCache';
import { isWindowWithHighlight, persistHighlight } from './persistHighlight';
import {
    contentModelToDom,
    createModelToDomContext,
    createModelToDomContextWithConfig,
} from 'roosterjs-content-model-dom';
import type { SetContentModel } from 'roosterjs-content-model-types';

const SelectionClassName = '__persistedSelection';
const SelectionSelector = '.' + SelectionClassName;
/**
 * @internal
 * Set content with content model
 * @param core The editor core object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export const setContentModel: SetContentModel = (core, model, option, onNodeCreated) => {
    const editorContext = core.api.createEditorContext(core, true /*saveIndex*/);
    const currentWindow = core.logicalRoot.ownerDocument.defaultView;
    if (currentWindow && isWindowWithHighlight(currentWindow)) {
        if (option?.shouldMaintainSelection) {
            editorContext.selectionClassName = SelectionClassName;
            core.api.setEditorStyle(core, SelectionClassName, 'background-color: #ddd!important', [
                SelectionSelector,
            ]);
        } else {
            core.api.setEditorStyle(core, SelectionClassName, null /*rule*/);
        }
    }

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

    persistHighlight(core, !!option?.shouldMaintainSelection, selection);

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

    return selection;
};
