import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteCollapsedSelection } from './deleteSteps/deleteCollapsedSelection';
import { deleteExpandedSelection } from './utils/deleteExpandedSelection';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import {
    DeleteSelectionContext,
    DeleteSelectionOptions,
    DeleteSelectionStep,
} from './utils/DeleteSelectionStep';

/**
 * @internal
 */
export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
}

const DefaultDeleteSelectionOptions: Required<DeleteSelectionOptions> = {
    direction: 'selectionOnly',
    onDeleteEntity: () => false,
};

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    options?: DeleteSelectionOptions
): DeleteSelectionResult {
    const fullOptions: Required<DeleteSelectionOptions> = {
        ...DefaultDeleteSelectionOptions,
        ...(options || {}),
    };
    const context: DeleteSelectionContext = { isChanged: false };

    DeleteSelectionSteps.forEach(step => step(context, fullOptions, model));

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
