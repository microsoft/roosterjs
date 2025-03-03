import type {
    FormatContentModelContext,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';
import {
    addBlock,
    createContentModelDocument,
    createDivider,
    mergeModel,
} from 'roosterjs-content-model-dom';

/**
 * Create a horizontal line and insert it into the model
 * @param model the model to insert horizontal line into
 * @param context the formatting context
 */
export function insertHorizontalLineIntoModel(
    model: ShallowMutableContentModelDocument,
    context: FormatContentModelContext
) {
    const hr = createDivider('hr');
    const doc = createContentModelDocument();
    addBlock(doc, hr);

    mergeModel(model, doc, context);
}
