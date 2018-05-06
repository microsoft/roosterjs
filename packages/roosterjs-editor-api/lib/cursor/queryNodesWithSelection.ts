import { Editor } from 'roosterjs-editor-core';
import { intersectWithNodeRange } from 'roosterjs-editor-dom';

/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 * @param nodeContainedByRangeOnly When set to true, only return the nodes contained by current selection. Default value is false
 * @param forEachCallback An optional callback to be invoked on each node in query result
 * @returns The nodes intersected with current selection, returns an empty array if no result is found
 */
export default function queryNodesWithSelection<T extends HTMLElement = HTMLElement>(
    editor: Editor,
    selector: string,
    nodeContainedByRangeOnly?: boolean,
    forEachCallback?: (node: T) => void
): T[] {
    let nodes = editor.queryElements<T>(selector);
    let range = editor.getSelectionRange();
    nodes = nodes.filter(node =>
        intersectWithNodeRange(node, range.start.node, range.end.node, nodeContainedByRangeOnly)
    );
    if (forEachCallback) {
        nodes.forEach(forEachCallback);
    }
    return nodes;
}
