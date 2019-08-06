import { ContentPosition } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { PositionContentSearcher } from 'roosterjs-editor-dom';

/**
 * Replace text before current selection with a node, current selection will be kept if possible
 * @param editor The editor instance
 * @param text The text for matching. We will try to match the text with the text before cursor
 * @param node The node to replace the text with
 * @param exactMatch True if the text must appear exactly before selection,
 * otherwise there can be some text between the tearget text and selection
 * @param searcher Optional PositionContentSearcher of current selection to help search text
 */
export default function replaceWithNode(
    editor: Editor,
    text: string,
    node: Node,
    exactMatch: boolean,
    searcher?: PositionContentSearcher
): boolean;

/**
 * Replace a given range with a node, current selection will be kept if possible
 * @param editor The editor instance
 * @param range The range to replace from
 * @param node The node to replace the text with
 * @param exactMatch True if the text must appear exactly before selection,
 * otherwise there can be some text between the tearget text and selection
 */
export default function replaceWithNode(
    editor: Editor,
    range: Range,
    node: Node,
    exactMatch: boolean
): boolean;

export default function replaceWithNode(
    editor: Editor,
    textOrRange: string | Range,
    node: Node,
    exactMatch: boolean,
    searcher?: PositionContentSearcher
): boolean {
    // Make sure the text and node is valid
    if (!textOrRange || !node) {
        return false;
    }

    let range: Range;

    if (typeof textOrRange == 'string') {
        searcher = searcher || editor.getContentSearcherOfCursor();
        range = searcher && searcher.getRangeFromText(textOrRange, exactMatch);
    } else {
        range = textOrRange;
    }

    if (range) {
        const backupRange = editor.getSelectionRange();

        // If the range to replace is right before current cursor, it is actually an exact match
        if (
            backupRange.collapsed &&
            range.endContainer == backupRange.startContainer &&
            range.endOffset == backupRange.startOffset
        ) {
            exactMatch = true;
        }

        editor.insertNode(node, {
            position: ContentPosition.Range,
            updateCursor: exactMatch,
            replaceSelection: true,
            insertOnNewLine: false,
            range: range,
        });

        return true;
    }

    return false;
}
