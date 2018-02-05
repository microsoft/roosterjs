import { Editor } from 'roosterjs-editor-core';
import { ChangeSource, SelectionRangeBase, Position } from 'roosterjs-editor-types';

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
    if (preserveSelection) {
        updateSelection(editor, range, <Node>fallbackNode);
    }

    editor.triggerContentChangedEvent(ChangeSource.Format);
    editor.addUndoSnapshot();
}

function updateSelection(
    editor: Editor,
    selectionRange: SelectionRangeBase,
    fallbackNode: Node
) {
    editor.focus();
    let range = editor.getDocument().createRange();
    let start = Position.create(selectionRange.start);
    let end = Position.create(selectionRange.end);
    if (editor.contains(start.node) && editor.contains(end.node)) {
        range.setStart(start.node, start.offset);
        range.setEnd(end.node, end.offset);
    } else if (fallbackNode instanceof Node) {
        range.selectNode(fallbackNode);
    } else {
        return;
    }

    editor.updateSelection(range);
}
