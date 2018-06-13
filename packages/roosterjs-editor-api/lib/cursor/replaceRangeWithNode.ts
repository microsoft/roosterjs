import { Editor } from 'roosterjs-editor-core';
import { PositionType } from 'roosterjs-editor-types/lib';

/**
 * Replace the specified range with a node
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch exactMatch is to match exactly
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
        editor.select(node, PositionType.After);
    } else if (backupRange && editor.contains(backupRange.startContainer)) {
        editor.select(backupRange);
    }

    return true;
}

export default replaceRangeWithNode;
