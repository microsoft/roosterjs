import { Editor } from 'roosterjs-editor-core';

/**
 * Replace the specified range with a node
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch True case: in Mentions, you type @nick, and then pick a suggestion from picker, we need to replace exactly everything before cursor (@nick)
 * with the suggestion from Mentions picker.
 * False case: In auto linkification, users could type "www.bing.com,<space>". The auto link will kick in on space
 * at the moment, what is before cursor is "www.bing.com,", however, only "www.bing.com" makes the link. by setting exactMatch = false, it does not match
 * right from the end, but can scan through till first same char is seen.
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
