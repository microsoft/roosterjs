import { Editor } from 'roosterjs-editor-core';
import { intersectWithNodeRange } from 'roosterjs-editor-dom';

/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 * @param nodeContainedByRangeOnly When set to true, only return the nodes contained by current selection. Default value is false
 * @returns The nodes intersected with current selection, returns an empty array if no result is found
 */
export default function queryNodesWithSelection(
    editor: Editor,
    selector: string,
    nodeContainedByRangeOnly?: boolean
): Node[] {
    let nodes = editor.queryNodes(selector);
    let range = editor.getSelectionRange();
    return nodes.filter(node =>
        intersectWithNodeRange(node, range.start.node, range.end.node, nodeContainedByRangeOnly)
    );
}
