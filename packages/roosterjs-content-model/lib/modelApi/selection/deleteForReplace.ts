import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteSelectedContent } from '../editing/deleteSelectedContent';
import { invokeDeleteSteps } from '../editing/invokeDeleteSteps';
import { mergeAfterDelete } from '../editing/mergeAfterDelete';
import {
    DeleteSelectionOptions,
    DeleteSelectionResult,
    DeleteSelectionStep,
} from '../editing/DeleteSelectionStep';

const DeleteAndReplaceSteps: DeleteSelectionStep[] = [deleteSelectedContent, mergeAfterDelete];

/**
 * @internal
 */
export function deleteForReplace(
    model: ContentModelDocument,
    options?: DeleteSelectionOptions
): DeleteSelectionResult {
    return invokeDeleteSteps(DeleteAndReplaceSteps, model, options);
}
