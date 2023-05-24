import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteExpandedSelection } from './steps/deleteExpandedSelection';
import { EditContext, EditOptions, EditStep, InsertPoint } from './utils/EditStep';
import { mergeAfterDelete } from './steps/mergeAfterDelete';

export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
    addUndoSnapshot: boolean;
}

const DefaultDeleteSelectionOptions: Required<EditOptions> = {
    keyCode: 0,
    onDeleteEntity: () => false,
    additionalSteps: [],
};

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    options?: EditOptions
): DeleteSelectionResult {
    const fullOptions: Required<EditOptions> = {
        ...DefaultDeleteSelectionOptions,
        ...(options || {}),
    };
    const context: EditContext = { isChanged: false };
    const steps = [
        deleteExpandedSelection,
        ...fullOptions.additionalSteps,
        mergeAfterDelete,
    ].filter(x => !!x) as EditStep[];

    steps.forEach(step => step(context, fullOptions, model));

    return {
        insertPoint: context.insertPoint || null,
        isChanged: context.isChanged,
        addUndoSnapshot: !!context.addUndoSnapshot,
    };
}
