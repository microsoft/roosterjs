import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import {
    DeleteSelectionContext,
    DeleteSelectionOptions,
    DeleteSelectionResult,
    DeleteSelectionStep,
} from './DeleteSelectionStep';

const DefaultDeleteSelectionOptions: Required<DeleteSelectionOptions> = {
    direction: 'selectionOnly',
    onDeleteEntity: () => false,
};

/**
 * @internal
 */
export function invokeDeleteSteps(
    steps: DeleteSelectionStep[],
    model: ContentModelDocument,
    options: DeleteSelectionOptions = {}
): DeleteSelectionResult {
    const fullOptions: Required<DeleteSelectionOptions> = Object.assign(
        {},
        DefaultDeleteSelectionOptions,
        options
    );
    const context: DeleteSelectionContext = { isChanged: false, insertPoint: null };

    steps.forEach(step => step(context, fullOptions, model));

    return context;
}
