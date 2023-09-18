import { contentModelToDom, createModelToDomContext } from 'roosterjs-content-model-dom';
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
    const range = contentModelToDom(
        core.contentDiv.ownerDocument,
        core.contentDiv,
        model,
        createModelToDomContext(
            core.api.createEditorContext(core),
            ...(core.defaultModelToDomOptions || []),
            option
        ),
        onNodeCreated
    );

    if (!core.lifecycle.shadowEditFragment) {
        core.api.select(core, range);
        core.cachedRangeEx = range || undefined;
    }

    return range;
};
