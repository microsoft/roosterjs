import CursorData from './CursorData';
import replaceWithNode from '../format/replaceWithNode';
import { Editor } from 'roosterjs-editor-core';

/**
 * @deprecated Use PositionContentSearcher.getRangeFromText() instead
 * Validate the text matches what's before the cursor, and return the range for it
 * @param editor The editor instance
 * @param text The text to match against
 * @param exactMatch Whether it is an exact match
 * @param cursorData The cursor data
 * @returns The range for the matched text, null if unable to find a match
 */
export function validateAndGetRangeForTextBeforeCursor(
    editor: Editor,
    text: string,
    exactMatch: boolean,
    cursorData: CursorData
): Range {
    if (!text || text.length == 0) {
        return;
    }

    let searcher = cursorData
        ? cursorData.getContentSearcher()
        : editor.getContentSearcherOfCursor();
    return searcher.getRangeFromText(text, exactMatch);
}

/**
 * @deprecated
 * Replace text before cursor with a node
 * @param editor The editor instance
 * @param text The text for matching. We will try to match the text with the text before cursor
 * @param node The node to replace the text with
 * @param exactMatch exactMatch is to match exactly, i.e.
 * In auto linkification, users could type URL followed by some punctuation and hit space. The auto link will kick in on space,
 * at the moment, what is before cursor could be "<URL>,", however, only "<URL>" makes the link. by setting exactMatch = false, it does not match
 * from right before cursor, but can scan through till first same char is seen. On the other hand if set exactMatch = true, it starts the match right
 * before cursor.
 * @param cursorData The Cursor data of current selection
 */
export default function replaceTextBeforeCursorWithNode(
    editor: Editor,
    text: string,
    node: Node,
    exactMatch: boolean,
    cursorData?: CursorData
): boolean {
    return replaceWithNode(
        editor,
        text,
        node,
        exactMatch,
        cursorData && cursorData.getContentSearcher()
    );
}
