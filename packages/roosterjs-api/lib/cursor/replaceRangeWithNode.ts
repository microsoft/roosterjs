import { Editor } from 'roosterjs-core';

// exactMatch means we're changing the text right before at cursor, reset the selection to end of range
// ensures that the cursor is in the right place. Otherwise, try to restore to previously stored selection
// to end of the range
function replaceRangeWithNode(
    editor: Editor,
    range: Range,
    node: Node,
    exactMatch: boolean
): boolean {
    // Make sure the range and node is valid
    if (!range || !node) {
        return false;
    }

    range.deleteContents();
    range.insertNode(node);

    if (exactMatch) {
        range.setEndAfter(node);
        range.collapse(false /*toStart*/);
        editor.updateSelection(range);
    }

    return true;
}

export default replaceRangeWithNode;
