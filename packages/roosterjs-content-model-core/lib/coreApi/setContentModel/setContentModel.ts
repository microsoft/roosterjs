import { updateCachedSelection } from '../../corePlugin/cache/updateCachedSelection';
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

    if (option?.shouldMaintainSelection) {
        if (CSS.highlights && Highlight) {
            const selectionEl = document.querySelector(SelectionSelector);
            if (selectionEl && selectionEl.textContent) {
                const textRange = new Range();
                textRange.setStart(selectionEl, 0);
                textRange.setEnd(selectionEl, selectionEl.textContent.length);
                const highlight = new Highlight(textRange);
                CSS.highlights.set(SelectionClassName, highlight);
            }
        } else {
            editorContext.selectionClassName = SelectionClassName;
            core.api.setEditorStyle(core, SelectionClassName, 'background-color: #ddd!important', [
                SelectionSelector,
            ]);
        }
    } else {
        core.api.setEditorStyle(core, SelectionClassName, null /*rule*/);
        CSS.highlights.delete(SelectionClassName);
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

    if (!core.lifecycle.shadowEditFragment) {
        updateCachedSelection(core.cache, selection || undefined);

        if (!option?.ignoreSelection && selection) {
            core.api.setDOMSelection(core, selection);
        } else {
            core.selection.selection = selection;
        }

        // Clear pending mutations since we will use our latest model object to replace existing cache
        core.cache.textMutationObserver?.flushMutations();
        core.cache.cachedModel = model;
    }

    return selection;
};
