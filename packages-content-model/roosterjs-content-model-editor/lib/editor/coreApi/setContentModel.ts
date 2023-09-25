import { SetContentModel } from '../../publicTypes/ContentModelEditorCore';
import {
    contentModelToDom,
    createModelToDomContext,
    createModelToDomContextWithConfig,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 * Set content with content model
 * @param core The editor core object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export const setContentModel: SetContentModel = (core, model, option, onNodeCreated) => {
    const editorContext = core.api.createEditorContext(core);
    const modelToDomContext = option
        ? createModelToDomContext(editorContext, ...(core.defaultModelToDomOptions || []), option)
        : createModelToDomContextWithConfig(core.defaultModelToDomConfig, editorContext);
    const range = contentModelToDom(
        core.contentDiv.ownerDocument,
        core.contentDiv,
        model,
        modelToDomContext,
        onNodeCreated
    );

    core.contentDiv.normalize();

    if (!core.lifecycle.shadowEditFragment) {
        core.cache.cachedRangeEx = range || undefined;
        core.api.select(core, range);
        core.cache.cachedModel = model;
    }

    return range;
};
