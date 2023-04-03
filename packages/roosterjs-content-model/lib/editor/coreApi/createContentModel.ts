import domToContentModel from '../../domToModel/domToContentModel';
import { cloneModel } from '../../modelApi/common/cloneModel';
import { CreateContentModel } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export const createContentModel: CreateContentModel = (core, option) => {
    let cachedModel = core.reuseModel && !option?.ignoreCache ? core.cachedModel : null;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel);
    }

    return (
        cachedModel ||
        domToContentModel(core.contentDiv, core.api.createEditorContext(core), {
            selectionRange: core.api.getSelectionRangeEx(core),
            alwaysNormalizeTable: true,
            ...core.defaultDomToModelOptions,
            ...(option || {}),
        })
    );
};
