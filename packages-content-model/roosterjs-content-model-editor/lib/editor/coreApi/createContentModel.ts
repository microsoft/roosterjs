import { cloneModel } from '../../modelApi/common/cloneModel';
import { domToContentModel } from 'roosterjs-content-model-dom';
import { DomToModelOption, DomToModelSelectionContext } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import { tablePreProcessor } from '../../domToModel/processors/tablePreProcessor';
import {
    ContentModelEditorCore,
    CreateContentModel,
} from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Create Content Model from DOM tree in this editor
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export const createContentModel: CreateContentModel = (core, option) => {
    let cachedModel = core.reuseModel ? core.cachedModel : null;

    if (cachedModel && core.lifecycle.shadowEditFragment) {
        // When in shadow edit, use a cloned model so we won't pollute the cached one
        cachedModel = cloneModel(cachedModel);
    }

    return cachedModel || internalCreateContentModel(core, option);
};

function internalCreateContentModel(
    core: ContentModelEditorCore,
    options: DomToModelOption | undefined
) {
    options = {
        ...core.defaultDomToModelOptions,
        ...(options || {}),
        processorOverride: {
            table: tablePreProcessor,
            ...options?.processorOverride,
        },
    };

    if (!core.reuseModel) {
        options.disableCacheElement = true;
    }

    const selection: DomToModelSelectionContext = {};
    const range = core.api.getSelectionRangeEx(core);

    switch (range?.type) {
        case SelectionRangeTypes.Normal:
            const regularRange = range.ranges[0];
            if (regularRange) {
                selection.selectionRootNode = regularRange.commonAncestorContainer;
                selection.regularSelection = regularRange;
            }
            break;

        case SelectionRangeTypes.TableSelection:
            if (range.coordinates && range.table) {
                selection.selectionRootNode = range.table;
                selection.tableSelection = {
                    table: range.table,
                    firstCell: { ...range.coordinates.firstCell },
                    lastCell: { ...range.coordinates.lastCell },
                };
            }

            break;

        case SelectionRangeTypes.ImageSelection:
            selection.selectionRootNode = range.image;
            selection.imageSelection = {
                image: range.image,
            };
            break;
    }

    return domToContentModel(
        core.contentDiv,
        options,
        core.api.createEditorContext(core),
        selection
    );
}
