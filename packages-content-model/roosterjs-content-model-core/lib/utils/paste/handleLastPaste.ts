import { cloneModel } from '../../publicApi/model/cloneModel';
import type { ClipboardData, ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function handleLastPaste(clipboardData: ClipboardData, model: ContentModelDocument) {
    if (clipboardData.modelBeforePaste) {
        const tempModel = cloneModel(clipboardData.modelBeforePaste, {
            includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
        });

        model.blocks = tempModel.blocks;
    } else {
        clipboardData.modelBeforePaste = cloneModel(model);
    }
}
