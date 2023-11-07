import { deleteExpandedSelection } from '../../modelApi/edit/utils/deleteExpandedSelection';
import type { ContentModelDocument } from 'roosterjs-content-model-types';
import type { FormatWithContentModelContext } from '../../publicTypes/parameter/FormatWithContentModelContext';
import type {
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    ValidDeleteSelectionContext,
} from '../../publicTypes/parameter/DeleteSelectionStep';

/**
 * Delete selected content from Content Model
 * @param model The model to delete selected content from
 * @param additionalSteps @optional Addition delete steps
 * @param formatContext @optional A context object provided by formatContentModel API
 * @returns A DeleteSelectionResult object to specify the deletion result
 */
export function deleteSelection(
    model: ContentModelDocument,
    additionalSteps: (DeleteSelectionStep | null)[] = [],
    formatContext?: FormatWithContentModelContext
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, formatContext);

    additionalSteps.forEach(step => {
        if (
            step &&
            isValidDeleteSelectionContext(context) &&
            context.deleteResult == 'notDeleted'
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
