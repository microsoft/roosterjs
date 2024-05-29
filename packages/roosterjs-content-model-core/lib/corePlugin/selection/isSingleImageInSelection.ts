import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function isSingleImageInSelection(selection: Selection | Range): HTMLImageElement | null {
    const { startNode, endNode, startOffset, endOffset } = getProps(selection);

    const max = Math.max(startOffset, endOffset);
    const min = Math.min(startOffset, endOffset);

    if (startNode && endNode && startNode == endNode && max - min == 1) {
        const node = startNode?.childNodes.item(min);
        if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'img')) {
            return node;
        }
    }
    return null;
}
function getProps(
    selection: Selection | Range
): { startNode: Node | null; endNode: Node | null; startOffset: number; endOffset: number } {
    if (isSelection(selection)) {
        return {
            startNode: selection.anchorNode,
            endNode: selection.focusNode,
            startOffset: selection.anchorOffset,
            endOffset: selection.focusOffset,
        };
    } else {
        return {
            startNode: selection.startContainer,
            endNode: selection.endContainer,
            startOffset: selection.startOffset,
            endOffset: selection.endOffset,
        };
    }
}

function isSelection(selection: Selection | Range): selection is Selection {
    return !!(selection as Selection).getRangeAt;
}
