import { Editor } from 'roosterjs-editor-core';

/**
 * Replace the specified range with a node
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch exactMatch is to match exactly, i.e.
 * In auto linkification, users could type URL followed by some punctuation and hit space. The auto link will kick in on space,
 * at the moment, what is before cursor could be "<URL>,", however, only "<URL>" makes the link. by setting exactMatch = false, it does not match
 * from right before cursor, but can scan through till first same char is seen. On the other hand if set exactMatch = true, it starts the match right
 * before cursor.
 * @returns True if we complete the replacement, false otherwise
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

    let backupRange = editor.getSelectionRange();

    range.deleteContents();
    range.insertNode(node);

    if (exactMatch) {
        range.setEndAfter(node);
        range.collapse(false /*toStart*/);
        editor.updateSelection(range);
    } else if (backupRange && editor.contains(backupRange.startContainer)) {
        editor.updateSelection(backupRange);
    }

    return true;
}

export default replaceRangeWithNode;
