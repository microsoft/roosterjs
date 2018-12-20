import replaceWithNode from '../format/replaceWithNode';
import { Editor } from 'roosterjs-editor-core';

/**
 * @deprecated Use replaceWithNode instead
 * Replace the specified range with a node
 * @param editor The editor instance
 * @param range The range in which content needs to be replaced
 * @param node The node to be inserted
 * @param exactMatch exactMatch is to match exactly
 * @returns True if we complete the replacement, false otherwise
 */
export default function replaceRangeWithNode(
    editor: Editor,
    range: Range,
    node: Node,
    exactMatch: boolean
): boolean {
    return replaceWithNode(editor, range, node, exactMatch);
}
