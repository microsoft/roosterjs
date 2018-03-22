import { DocumentPosition } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { isDocumentPosition } from 'roosterjs-editor-dom';

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
    let result: Node[] = [];
    let nodes = editor.queryContent(selector);
    let range = editor.getSelectionRange();
    if (range) {
        for (let i = 0; i < nodes.length; i++) {
            if (isIntersectWithNodeRange(nodes[i], range, nodeContainedByRangeOnly)) {
                result.push(nodes[i]);
            }
        }
    }
    return result;
}

function isIntersectWithNodeRange(
    node: Node,
    range: Range,
    nodeContainedByRangeOnly: boolean
): boolean {
    let startPosition = node.compareDocumentPosition(range.startContainer);
    let endPosition = node.compareDocumentPosition(range.endContainer);
    let targetPositions = [DocumentPosition.Same, DocumentPosition.Contains];

    if (!nodeContainedByRangeOnly) {
        targetPositions.push(DocumentPosition.ContainedBy);
    }

    return (
        isDocumentPosition(startPosition, targetPositions) || // intersectStart
        isDocumentPosition(endPosition, targetPositions) || // intersectEnd // Contains
        (isDocumentPosition(startPosition, DocumentPosition.Preceding) &&
            isDocumentPosition(endPosition, DocumentPosition.Following) &&
            !isDocumentPosition(endPosition, DocumentPosition.ContainedBy))
    );
}
