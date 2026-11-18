import {
    addBlock,
    createContentModelDocument,
    createDivider,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDividerFormat,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Insert a horizontal line into the model at current selection
 */
export function insertHorizontalLineIntoModel(
    model: ReadonlyContentModelDocument,
    context: FormatContentModelContext,
    format: ContentModelDividerFormat = {
        borderTop: '1px none',
        borderRight: '1px none',
        borderBottom: '1px solid',
        borderLeft: '1px none',
        width: '98%',
        display: 'inline-block',
    }
): boolean {
    const doc = createContentModelDocument();
    addBlock(doc, createDivider('hr', format));

    return !!mergeModel(model, doc, context);
}
