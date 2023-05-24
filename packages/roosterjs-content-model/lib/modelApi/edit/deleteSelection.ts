import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteExpandedSelection } from './steps/deleteExpandedSelection';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import {
    DeleteSelectionOptions,
    DeleteSelectionContext,
    DeleteSelectionStep,
    InsertableDeleteSelectionContext,
} from './utils/DeleteSelectionStep';

export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
    addUndoSnapshot: boolean;
}

const DefaultDeleteSelectionOptions: Required<DeleteSelectionOptions> = {
    onDeleteEntity: () => false,
};

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    additionalSteps: (DeleteSelectionStep | null)[] = [],
    options?: DeleteSelectionOptions
): DeleteSelectionResult {
    const fullOptions: Required<DeleteSelectionOptions> = {
        ...DefaultDeleteSelectionOptions,
        ...(options || {}),
    };
    const context = deleteExpandedSelection(fullOptions, model);

    additionalSteps.forEach(step => {
        if (step && isInsertableContext(context) && !context.isChanged) {
            step(context, fullOptions);
        }
    });

    // if we end up with multiple paragraphs impacted, we need to merge them
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
