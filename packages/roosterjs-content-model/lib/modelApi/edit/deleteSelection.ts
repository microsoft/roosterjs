import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteCollapsedSelection } from './deleteSteps/deleteCollapsedSelection';
import { deleteExpandedSelection } from './utils/deleteExpandedSelection';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import {
    DeleteSelectionContext,
    DeleteSelectionStep,
    OnDeleteEntity,
} from './utils/DeleteSelectionStep';

/**
 * @internal
 */
export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
}

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    onDeleteEntity: OnDeleteEntity,
    direction: 'forward' | 'backward' | 'selectionOnly' = 'selectionOnly'
): DeleteSelectionResult {
    const context: DeleteSelectionContext = { isChanged: false };

    DeleteSelectionSteps.forEach(step => step(context, onDeleteEntity, model, direction));

    return { insertPoint: context.insertPoint || null, isChanged: context.isChanged };
}

// If we end up with multiple paragraphs impacted, we need to merge them
const mergeParagraphAfterDelete: DeleteSelectionStep = context => {
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
};

const DeleteSelectionSteps: DeleteSelectionStep[] = [
    deleteExpandedSelection,
    deleteCollapsedSelection,
    mergeParagraphAfterDelete,
];
