import { Editor } from 'roosterjs-editor-core';

/**
 * exactMatch means we're changing the text right before at cursor, reset the selection to end of range
 * ensures that the cursor is in the right place. Otherwise, try to restore to previously stored selection
 * to end of the range
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch Whether it is exactMatch
 */
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
