import { deleteExpandedSelection } from '../../modelApi/edit/deleteExpandedSelection';
import type {
    ContentModelDocument,
    DeleteResult,
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    FormatWithContentModelContext,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * Delete selected content from Content Model
 * @param model The model to delete selected content from
 * @param additionalSteps @optional Addition delete steps
 * @param formatContext @optional A context object provided by formatContentModel API
 * @param additionalStepsResult  @optional The delete result to trigger the additional steps @default 'notDeleted'
 * @returns A DeleteSelectionResult object to specify the deletion result
 */
export function deleteSelection(
    model: ContentModelDocument,
    additionalSteps: (DeleteSelectionStep | null)[] = [],
    formatContext?: FormatWithContentModelContext,
    additionalStepsResult: DeleteResult = 'notDeleted'
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, formatContext);

    additionalSteps.forEach(step => {
        if (
            step &&
            isValidDeleteSelectionContext(context) &&
            context.deleteResult == additionalStepsResult
        ) {
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
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
}
