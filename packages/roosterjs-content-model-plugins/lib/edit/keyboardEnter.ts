import { deleteEmptyQuote } from './deleteSteps/deleteEmptyQuote';
import { deleteSelection, normalizeContentModel } from 'roosterjs-content-model-dom';
import { handleEnterOnList } from './inputSteps/handleEnterOnList';
import { handleEnterOnParagraph } from './inputSteps/handleEnterOnParagraph';
import type { DOMSelection, DeleteSelectionStep, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardEnter(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    editor.formatContentModel(
        (model, context) => {
            const result = deleteSelection(model, getInputSteps(selection, rawEvent), context);

            if (result.deleteResult == 'range') {
                // We have deleted something, next input should inherit the segment format from deleted content, so set pending format here
                context.newPendingFormat = result.insertPoint?.marker.format;

                normalizeContentModel(model);

                rawEvent.preventDefault();
                return true;
            } else {
                return false;
            }
        },
        {
            rawEvent,
        }
    );
}

function getInputSteps(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    const result: DeleteSelectionStep[] = [clearDeleteResult];

    if (selection && selection.type != 'table') {
        if (rawEvent.shiftKey) {
            result.push(handleEnterOnParagraph);
        } else {
            result.push(handleEnterOnList, deleteEmptyQuote, handleEnterOnParagraph);
        }
    }

    return result;
}

const clearDeleteResult: DeleteSelectionStep = context => {
    // For ENTER key, although we may have deleted something, since we still need to split the line, we always treat it as not delete
    // so further delete steps can keep working
    context.deleteResult = 'notDeleted';
};
