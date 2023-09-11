import {
    contentModelToDom,
    createModelToDomContext,
    createModelToDomContextWithConfig,
} from 'roosterjs-content-model-dom';
import { SetContentModel } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Set content with content model
 * @param core The editor core object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
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

    if (!core.lifecycle.shadowEditFragment) {
        core.api.select(core, range);
        core.cachedRangeEx = range || undefined;
    }

    return range;
};
