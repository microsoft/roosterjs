import { deleteSelection, isModifierKey } from 'roosterjs-content-model-core';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import type { DOMSelection, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardInput(editor: IStandaloneEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (shouldInputWithContentModel(selection, rawEvent)) {
        editor.takeSnapshot();

        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(model, [], context);

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
                rawEvent,
            }
        );

        return true;
    }
}

function shouldInputWithContentModel(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    if (!selection) {
        return false; // Nothing to delete
    } else if (
        !isModifierKey(rawEvent) &&
        (rawEvent.key == 'Enter' || rawEvent.key == 'Space' || rawEvent.key.length == 1)
    ) {
        return selection.type != 'range' || !selection.range.collapsed;
    } else {
        return false;
    }
}
