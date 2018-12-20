import { Editor } from 'roosterjs-editor-core';
import { QueryScope } from 'roosterjs-editor-types';

/**
 * @deprecated Use Editor.queryElements() instead
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
    return editor.queryElements(
        selector,
        nodeContainedByRangeOnly ? QueryScope.InSelection : QueryScope.OnSelection,
        forEachCallback
    );
}
