import { deleteEmptyQuote } from './deleteSteps/deleteEmptyQuote';
import { deleteSelection, isModifierKey, normalizeContentModel } from 'roosterjs-content-model-dom';
import { handleEnterOnList } from './inputSteps/handleEnterOnList';
import type { DOMSelection, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardInput(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (shouldInputWithContentModel(selection, rawEvent)) {
        editor.takeSnapshot();

        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(model, getInputSteps(selection, rawEvent), context);

                // We have deleted selection then we will let browser to handle the input.
                // With this combined operation, we don't wan to mass up the cached model so clear it
                context.clearModelCache = true;

                // Skip undo snapshot here and add undo snapshot before the operation so that we don't add another undo snapshot in middle of this replace operation
                context.skipUndoSnapshot = true;

                if (result.deleteResult == 'range') {
                    // We have deleted something, next input should inherit the segment format from deleted content, so set pending format here
                    context.newPendingFormat = result.insertPoint?.marker.format;

                    normalizeContentModel(model);

                    // Do not preventDefault since we still want browser to handle the final input for now
                    return true;
                } else {
                    return false;
                }
            },
            {
                scrollCaretIntoView: false, // TODO #2633: Make a full fix to the scroll behavior
                rawEvent,
            }
        );

        return true;
    }
}

function getInputSteps(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    return shouldHandleEnterKey(selection, rawEvent) ? [handleEnterOnList, deleteEmptyQuote] : [];
}

function shouldInputWithContentModel(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    if (!selection) {
        return false; // Nothing to delete
    } else if (
        !isModifierKey(rawEvent) &&
        (rawEvent.key == 'Enter' || rawEvent.key == 'Space' || rawEvent.key.length == 1)
    ) {
        return (
            selection.type != 'range' ||
            !selection.range.collapsed ||
            shouldHandleEnterKey(selection, rawEvent)
        );
    } else {
        return false;
    }
}

const shouldHandleEnterKey = (selection: DOMSelection | null, rawEvent: KeyboardEvent) => {
    return selection && selection.type == 'range' && rawEvent.key == 'Enter' && !rawEvent.shiftKey;
};
