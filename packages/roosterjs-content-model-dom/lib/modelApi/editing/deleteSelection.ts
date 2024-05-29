import { deleteExpandedSelection } from './deleteExpandedSelection';
import { mutateBlock } from '../common/mutate';
import type {
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * Delete selected content from Content Model
 * @param model The model to delete selected content from
 * @param additionalSteps @optional Addition delete steps
 * @param formatContext @optional A context object provided by formatContentModel API
 * @returns A DeleteSelectionResult object to specify the deletion result
 */
export function deleteSelection(
    model: ReadonlyContentModelDocument,
    additionalSteps: (DeleteSelectionStep | null)[] = [],
    formatContext?: FormatContentModelContext
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, formatContext);

    additionalSteps.forEach(step => {
        if (step && isValidDeleteSelectionContext(context)) {
            step(context);
        }
    });

    mergeParagraphAfterDelete(context);
    return context;
}

function isValidDeleteSelectionContext(
    context: DeleteSelectionContext
): context is ValidDeleteSelectionContext {
    return !!context.insertPoint;
}

// If we end up with multiple paragraphs impacted, we need to merge them
function mergeParagraphAfterDelete(context: DeleteSelectionContext) {
    const { insertPoint, deleteResult, lastParagraph, lastTableContext } = context;

    if (
        insertPoint &&
        deleteResult != 'notDeleted' &&
        deleteResult != 'nothingToDelete' &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        const mutableLastParagraph = mutateBlock(lastParagraph);

        mutateBlock(insertPoint.paragraph).segments.push(...mutableLastParagraph.segments);
        mutableLastParagraph.segments = [];
    }
}
