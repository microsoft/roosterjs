import { deleteExpandedSelection } from './deleteExpandedSelection';
import { mutateBlock } from '../common/mutate';
import { runEditSteps } from './runEditSteps';
import type {
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
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
    const steps = additionalSteps.filter(
        (x: DeleteSelectionStep | null): x is DeleteSelectionStep => !!x
    );

    runEditSteps(steps, context);

    mergeParagraphAfterDelete(context);
    return context;
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
