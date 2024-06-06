import type {
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * Run editing steps on top of a given context object which includes current insert point and previous editing result
 * @param steps The editing steps to run
 * @param context Context for the editing steps.
 */
export function runEditSteps(steps: DeleteSelectionStep[], context: DeleteSelectionResult) {
    steps.forEach(step => {
        if (step && isValidDeleteSelectionContext(context)) {
            step(context);
        }
    });
}

function isValidDeleteSelectionContext(
    context: DeleteSelectionContext
): context is ValidDeleteSelectionContext {
    return !!context.insertPoint;
}
