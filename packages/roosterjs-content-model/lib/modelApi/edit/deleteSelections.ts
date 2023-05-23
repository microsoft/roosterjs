import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteCollapsedSelection } from './steps/deleteCollapsedSelection';
import { deleteExpandedSelection } from './steps/deleteExpandedSelection';
import { deleteWordSelection } from './steps/deleteWordSelection';
import { EditContext, EditOptions, EditStep, InsertPoint } from './steps/EditStep';
import { mergeAfterDelete } from './steps/mergeAfterDelete';

export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
}

const DeleteSelectionSteps: EditStep[] = [
    deleteExpandedSelection,
    deleteWordSelection,
    deleteCollapsedSelection,
    mergeAfterDelete,
];

const DefaultDeleteSelectionOptions: Required<EditOptions> = {
    direction: 'selectionOnly',
    onDeleteEntity: () => false,
    deleteWord: false,
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

    DeleteSelectionSteps.forEach(step => step(context, fullOptions, model));

    return { insertPoint: context.insertPoint || null, isChanged: context.isChanged };
}
