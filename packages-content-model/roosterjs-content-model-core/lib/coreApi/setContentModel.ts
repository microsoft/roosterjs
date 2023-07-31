import { contentModelToDom } from 'roosterjs-content-model-dom';
import { SetContentModel } from '../coreEditor/ContentModelEditor2Core';

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

    if (!core.isInShadowEdit) {
        core.api.select(core, range);
        core.cachedRangeEx = range || undefined;
    }

    return range;
};
