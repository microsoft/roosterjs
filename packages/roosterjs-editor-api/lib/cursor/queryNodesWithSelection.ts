import { Editor } from 'roosterjs-editor-core';
import { intersectWithNodeRange } from 'roosterjs-editor-dom';

/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 * @returns The nodes intersected with current selection, returns an empty array if no result is found
 */
export default function queryNodesWithSelection(editor: Editor, selector: string): Node[] {
    let result: Node[] = [];
    let nodes = editor.queryNodes(selector);
    let range = editor.getSelectionRange();
    for (let i = 0; i < nodes.length; i++) {
        if (
            intersectWithNodeRange(
                nodes[i],
                range.start.node,
                range.end.node,
                false /*containOnly*/
            )
        ) {
            result.push(nodes[i]);
        }
    }
    return result;
}
