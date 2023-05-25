import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteExpandedSelection } from './utils/deleteExpandedSelection';
import {
    DeleteResult,
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    InsertableDeleteSelectionContext,
    OnDeleteEntity,
} from './utils/DeleteSelectionStep';

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    onDeleteEntity: OnDeleteEntity,
    additionalSteps: (DeleteSelectionStep | null)[] = []
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, onDeleteEntity);

    additionalSteps.forEach(step => {
        if (
            step &&
            isInsertableContext(context) &&
            context.deleteResult == DeleteResult.NotDeleted
        ) {
            step(context, onDeleteEntity);
        }
    });

    mergeParagraphAfterDelete(context);

    return context;
}

function isInsertableContext(
    context: DeleteSelectionContext
): context is InsertableDeleteSelectionContext {
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
