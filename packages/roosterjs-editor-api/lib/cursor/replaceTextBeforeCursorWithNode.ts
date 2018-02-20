import CursorData from './CursorData';
import replaceRangeWithNode from './replaceRangeWithNode';
import { InlineElement } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
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

    // This function works backwards to do match as text node is found. We used two set of "text" and "index"
    // text, textIndex is for the whole text to be matched
    // nodeContent, nodeIndex is for current text node found before cursor
    // Every time a new node is found, nodeContent and nodeIndex will be reset, while text remains, and textIndex
    // keep decreasing till it reaches -1 (on a match case) or mismatch half way
    let matchComplete = false;
    // The range for the matched text
    let range = editor.getDocument().createRange();
    // This is the start index, which points to last char from text. We match from end to begin
    let textIndex = text.length - 1;
    // endMatched to indicate if the end of text is matched
    // For exactMatch, since we need to match from last char, endMatched should just be true right away
    // For exactMatch == false, endMatched is set when first same char is seen from the text node that
    // can match last char from text as we walk backwards
    let endMatched = exactMatch;
    // The end of range is set or not
    let endOfRangeSet = false;
    // The cursor data, create a new one from editor when not supplied
    let cursor = cursorData || new CursorData(editor);
    cursor.getTextSectionBeforeCursorTill((textInline: InlineElement): boolean => {
        let nodeContent = textInline.getTextContent();
        let nodeIndex = nodeContent ? nodeContent.length - 1 : -1;
        while (nodeIndex >= 0 && textIndex >= 0) {
            if (text.charCodeAt(textIndex) == nodeContent.charCodeAt(nodeIndex)) {
                if (!endMatched) {
                    endMatched = true;
                }

                // on first time when end is matched, set the end of range
                if (endMatched && !endOfRangeSet) {
                    range.setEnd(
                        textInline.getContainerNode(),
                        textInline.getStartPosition().offset + nodeIndex + 1
                    );
                    endOfRangeSet = true;
                }

                // Move both index one char backward
                nodeIndex--;
                textIndex--;
            } else {
                // We have a mis-match here
                // if exactMatch is desired or endMatched is already matched,
                // we should just call it an unsuccessful match and return
                if (exactMatch || endMatched) {
                    matchComplete = true;
                    break;
                } else {
                    // This is the case where exactMatch == false, and end is not matched yet
                    // minus just nodeIndex, since we're still trying to match the end char
                    nodeIndex--;
                }
            }
        }

        // when textIndex == -1, we have a successful complete match
        if (textIndex == -1) {
            matchComplete = true;
            range.setStart(
                textInline.getContainerNode(),
                textInline.getStartPosition().offset + nodeIndex + 1
            );
        }

        return matchComplete;
    });

    // textIndex == -1 means a successful complete match
    return textIndex == -1 ? range : null;
}

/**
 * Replace text before cursor with a node
 * @param editor The editor instance
 * @param text The text for matching. We will try to match the text with the text before cursor
 * @param node The node to replace the text with
 * @param exactMatch exactMatch is to match exactly, i.e.
 * In auto linkification, users could type URL followed by some punctuation and hit space. The auto link will kick in on space,
 * at the moment, what is before cursor could be "<URL>,", however, only "<URL>" makes the link. by setting exactMatch = false, it does not match
 * from right before cursor, but can scan through till first same char is seen. On the other hand if set exactMatch = true, it starts the match right
 * before cursor.
 * @param cursorData
 */
export default function replaceTextBeforeCursorWithNode(
    editor: Editor,
    text: string,
    node: Node,
    exactMatch: boolean,
    cursorData?: CursorData
): boolean {
    // Make sure the text and node is valid
    if (!text || text.length == 0 || !node) {
        return false;
    }

    let replaced = false;
    let range = validateAndGetRangeForTextBeforeCursor(editor, text, exactMatch, cursorData);
    if (range) {
        replaced = replaceRangeWithNode(editor, range, node, exactMatch);
    }

    return replaced;
}
