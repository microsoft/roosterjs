import { Editor } from 'roosterjs-editor-core';
import { ChangeSource } from 'roosterjs-editor-types';

/**
 * Execute format with undo
 * It tries to add undo snapshot at begin and end of the function. Duplicated snapshot will only be added once
 * @param editor The editor instance
 * @param formatter The callback format function we want to perform, it also creates a fallback node for selection.
 * A fallback node is a node to update selection to if start point or end point is not avaiable/valid
 * @param preserveSelection (Optional) Whether to preserve selection, if set to true,
 * we update the selection to original selection range.
 */
export default function execFormatWithUndo(
    editor: Editor,
    formatter: () => Node | void | any,
    preserveSelection?: boolean
) {
    editor.addUndoSnapshot();
    let range = editor.getSelectionRange();
    let fallbackNode = formatter();
    if (preserveSelection &&
        !editor.select(range.start, range.end) &&
        fallbackNode instanceof Node
    ) {
        editor.select(<Node>fallbackNode);
    }

    editor.triggerContentChangedEvent(ChangeSource.Format);
    editor.addUndoSnapshot();
}
