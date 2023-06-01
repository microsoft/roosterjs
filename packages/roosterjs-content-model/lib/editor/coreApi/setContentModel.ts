import contentModelToDom from '../../modelToDom/contentModelToDom';
import { SetContentModel } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Set content with content model
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export const setContentModel: SetContentModel = (core, model, option) => {
    const range = contentModelToDom(
        core.contentDiv.ownerDocument,
        core.contentDiv,
        model,
        core.api.createEditorContext(core),
        {
            ...core.defaultModelToDomOptions,
            ...(option || {}),
        }
    );

    if (!core.lifecycle.shadowEditFragment) {
        core.api.select(core, range);

        // We realize a behavior when current paragraph is empty (only has a BR), the focus
        // will not be correctly set, and the final result. When this happens, focus will be directly
        // put under editor content DIV.
        // To workaround it, we can set focus again after a rerender, so we can call requestAnimationFrame
        // and set focus again
        if (
            core.api.getSelectionRange(core, false /*tryGetFromCache*/)?.startContainer ==
            core.contentDiv
        ) {
            core.contentDiv.ownerDocument.defaultView?.requestAnimationFrame(() => {
                core.api.select(core, range);
            });
        }
    }
};
