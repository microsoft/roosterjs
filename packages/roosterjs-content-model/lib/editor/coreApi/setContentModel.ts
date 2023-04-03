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
    }
};
