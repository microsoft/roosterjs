import { Editor } from 'roosterjs-editor-core';
import { isPositionAtBeginningOf, Position } from 'roosterjs-editor-dom';

export default function shouldInsertLineBefore(editor: Editor, focusNode: Node) {
    let range = editor.getSelectionRange();
    if (range && range.collapsed && isPositionAtBeginningOf(Position.getStart(range), focusNode)) {
        let traverser = editor.getBodyTraverser(focusNode);
        return !traverser.getPreviousBlockElement();
    }

    return false;
}
