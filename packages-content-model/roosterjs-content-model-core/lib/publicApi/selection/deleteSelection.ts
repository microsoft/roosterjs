import { deleteExpandedSelection } from '../../modelApi/edit/deleteExpandedSelection';
import type {
    ContentModelDocument,
    DeleteSelectionContext,
    DeleteSelectionResult,
    EditingStep,
    FormatWithContentModelContext,
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
    model: ContentModelDocument,
    additionalSteps: (EditingStep | null)[] = [],
    formatContext?: FormatWithContentModelContext
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, formatContext);

    additionalSteps.forEach(step => {
        if (step && isValidDeleteSelectionContext(context) && shouldRun(step, context)) {
            const stepFunc = typeof step == 'function' ? step : step.callback;

            stepFunc(context);
        }
    });

    mergeParagraphAfterDelete(context);

    return context;
}

function shouldRun(step: EditingStep, context: ValidDeleteSelectionContext) {
    return typeof step == 'function'
        ? context.deleteResult == 'notDeleted'
        : step.shouldRun(context);
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
