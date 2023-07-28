import { ContentModelDocument } from 'roosterjs-content-model-types';
import { deleteExpandedSelection } from './utils/deleteExpandedSelection';
import { FormatWithContentModelContext } from '../../publicApi/utils/formatWithContentModel';
import {
    DeleteResult,
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    ValidDeleteSelectionContext,
} from './utils/DeleteSelectionStep';

/**
 * @internal
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
            context.deleteResult == DeleteResult.NotDeleted
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
        deleteResult != DeleteResult.NotDeleted &&
        deleteResult != DeleteResult.NothingToDelete &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
}
