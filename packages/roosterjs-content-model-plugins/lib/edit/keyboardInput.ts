import {
    ChangeSource,
    createText,
    deleteSelection,
    isModifierKey,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep, DOMSelection, IEditor } from 'roosterjs-content-model-types';

// Insert a ZeroWidthSpace(ZWS) segment with selection before selection marker
// so that later browser will replace this selection with inputted text and keep format
const insertZWS: DeleteSelectionStep = context => {
    if (context.deleteResult == 'range') {
        const { marker, paragraph } = context.insertPoint;
        const index = paragraph.segments.indexOf(marker);

        if (index >= 0) {
            const text = createText('\u200B', marker.format);
            text.isSelected = true;

            paragraph.segments.splice(index, 0, text);
        }
    }
};

/**
 * @internal
 */
export function keyboardInput(editor: IEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (shouldInputWithContentModel(selection, rawEvent)) {
        editor.takeSnapshot();

        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(model, [insertZWS], context);

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
                scrollCaretIntoView: true,
                rawEvent,
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => rawEvent.which,
                apiName: 'handleInputKey',
            }
        );

        return true;
    }
}

function shouldInputWithContentModel(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    if (!selection) {
        return false; // Nothing to delete
    } else if (!isModifierKey(rawEvent) && (rawEvent.key == 'Space' || rawEvent.key.length == 1)) {
        return selection.type != 'range' || !selection.range.collapsed;
    } else {
        return false;
    }
}
