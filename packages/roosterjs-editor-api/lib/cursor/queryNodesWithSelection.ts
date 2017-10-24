import { DocumentPosition } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { isDocumentPosition } from 'roosterjs-editor-dom';

/**
 * Query nodes intersected with current selection using a selector
 * @param editor The editor
 * @param selector The selector to query
 */
export default function queryNodesWithSelection(editor: Editor, selector: string): Node[] {
    let result: Node[] = [];
    let nodes = editor.queryContent(selector);
    let range = editor.getSelectionRange();
    for (let i = 0; i < nodes.length; i++) {
        if (isIntersectWithNodeRange(nodes[i], range)) {
            result.push(nodes[i]);
        }
    }
    return result;
}

function isIntersectWithNodeRange(node: Node, range: Range): boolean {
    let startPosition = node.compareDocumentPosition(range.startContainer);
    let endPosition = node.compareDocumentPosition(range.endContainer);
    let targetPositions = [
        DocumentPosition.Same,
        DocumentPosition.ContainedBy,
        DocumentPosition.Contains,
    ];
    let intersectStart = isDocumentPosition(startPosition, targetPositions);
    let intersectEnd = isDocumentPosition(endPosition, targetPositions);
    let inner =
        isDocumentPosition(startPosition, DocumentPosition.Preceding) &&
        isDocumentPosition(endPosition, DocumentPosition.Following);
    return intersectStart || intersectEnd || inner;
}
