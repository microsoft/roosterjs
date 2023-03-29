import { ContentPosition, IEditor, IPositionContentSearcher } from 'roosterjs-editor-types';

/**
 * Replace text before current selection with a node, current selection will be kept if possible
 * @param editor The editor instance
 * @param text The text for matching. We will try to match the text with the text before cursor
 * @param node The node to replace the text with
 * @param exactMatch True if the text must appear exactly before selection,
 * otherwise there can be some text between the target text and selection
 * @param searcher Optional PositionContentSearcher of current selection to help search text
 */
export default function replaceWithNode(
    editor: IEditor,
    text: string,
    node: Node,
    exactMatch: boolean,
    searcher?: IPositionContentSearcher
): boolean;

/**
 * Replace a given range with a node, current selection will be kept if possible
 * @param editor The editor instance
 * @param range The range to replace from
 * @param node The node to replace the text with
 * @param exactMatch True if the text must appear exactly before selection,
 * otherwise there can be some text between the target text and selection
 */
export default function replaceWithNode(
    editor: IEditor,
    range: Range,
    node: Node,
    exactMatch: boolean
): boolean;

export default function replaceWithNode(
    editor: IEditor,
    textOrRange: string | Range,
    node: Node,
    exactMatch: boolean,
    searcher?: IPositionContentSearcher
): boolean {
    // Make sure the text and node is valid
    if (!textOrRange || !node) {
        return false;
    }

    let range: Range | null;

    if (typeof textOrRange == 'string') {
        searcher = (searcher || editor.getContentSearcherOfCursor()) ?? undefined;
        range = searcher?.getRangeFromText(textOrRange, exactMatch) ?? null;
    } else {
        range = textOrRange;
    }

    if (range) {
        const backupRange = editor.getSelectionRange();

        // If the range to replace is right before current cursor, it is actually an exact match
        if (
            backupRange?.collapsed &&
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
