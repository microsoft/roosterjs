import type { DOMHelper, DOMInsertPoint } from 'roosterjs-content-model-types';

/**
 * Get insertion point from coordinate.
 * @param doc Parent document object
 * @param domHelper The DOM helper of the editor
 * @param x The cursor coordinate for the x-axis
 * @param y The cursor coordinate for the y-axis
 */
export function getNodePositionFromEvent(
    doc: Document,
    domHelper: DOMHelper,
    x: number,
    y: number
): DOMInsertPoint | null {
    if ('caretPositionFromPoint' in doc) {
        // Firefox, Chrome, Edge, Safari, Opera
        const pos = (doc as any).caretPositionFromPoint(x, y);
        if (pos && domHelper.isNodeInEditor(pos.offsetNode)) {
            return normalizePosition(pos.offsetNode, pos.offset);
        }
    }

    if (doc.caretRangeFromPoint) {
        // Safari
        const range = doc.caretRangeFromPoint(x, y);
        if (range && domHelper.isNodeInEditor(range.startContainer)) {
            return normalizePosition(range.startContainer, range.startOffset);
        }
    }

    if (doc.elementFromPoint) {
        // Fallback
        const element = doc.elementFromPoint(x, y);
        if (element && domHelper.isNodeInEditor(element)) {
            return { node: element, offset: 0 };
        }
    }

    return null;
}

function normalizePosition(node: Node, offset: number): DOMInsertPoint {
    // Safari hit-testing in tableMoverTest returns offset 1 after the lone BR of an empty block.
    const normalizedOffset =
        offset == 1 && node.childNodes.length == 1 && node.firstChild?.nodeName == 'BR'
            ? 0
            : offset;

    return { node, offset: normalizedOffset };
}
