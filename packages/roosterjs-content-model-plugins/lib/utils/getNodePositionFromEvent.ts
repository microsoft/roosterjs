import type { DOMInsertPoint, IEditor } from 'roosterjs-content-model-types';

// Get insertion point from coordinate.
export function getNodePositionFromEvent(
    editor: IEditor,
    x: number,
    y: number
): DOMInsertPoint | null {
    const doc = editor.getDocument();
    const domHelper = editor.getDOMHelper();

    if ('caretPositionFromPoint' in doc) {
        // Firefox, Chrome, Edge, Safari, Opera
        const pos = (doc as any).caretPositionFromPoint(x, y);
        if (pos && domHelper.isNodeInEditor(pos.offsetNode)) {
            return { node: pos.offsetNode, offset: pos.offset };
        }
    }

    if (doc.caretRangeFromPoint) {
        // Safari
        const range = doc.caretRangeFromPoint(x, y);
        if (range && domHelper.isNodeInEditor(range.startContainer)) {
            return { node: range.startContainer, offset: range.startOffset };
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
