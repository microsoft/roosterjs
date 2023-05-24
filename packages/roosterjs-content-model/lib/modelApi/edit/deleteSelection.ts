import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteExpandedSelection } from './utils/deleteExpandedSelection';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import {
    DeleteSelectionContext,
    DeleteSelectionStep,
    InsertableDeleteSelectionContext,
    OnDeleteEntity,
} from './utils/DeleteSelectionStep';

/**
 * @internal
 */
export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
    addUndoSnapshot: boolean;
}

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
        if (step && isInsertableContext(context) && !context.isChanged) {
            step(context, onDeleteEntity);
        }
    });

    mergeParagraphAfterDelete(context);

    return {
        insertPoint: context.insertPoint || null,
        isChanged: context.isChanged,
        addUndoSnapshot: !!context.addUndoSnapshot,
    };
}

function isInsertableContext(
    context: DeleteSelectionContext
): context is InsertableDeleteSelectionContext {
    return !!context.insertPoint;
}

// If we end up with multiple paragraphs impacted, we need to merge them
function mergeParagraphAfterDelete(context: DeleteSelectionContext) {
    const { insertPoint, isChanged, lastParagraph, lastTableContext } = context;

    if (
        insertPoint &&
        isChanged &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
}
