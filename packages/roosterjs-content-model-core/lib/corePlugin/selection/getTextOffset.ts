import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { DOMHelper } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getTextOffset(
    doc: Document,
    range: Range,
    domHelper: DOMHelper
): number | undefined {
    if (!isNodeOfType(range.startContainer, 'TEXT_NODE')) {
        return undefined;
    }

    const blockElement = domHelper.findClosestBlockElement(range.startContainer);

    let textLength = 0;
    const walker = doc.createTreeWalker(blockElement, NodeFilter.SHOW_TEXT);

    if (walker) {
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node === range.startContainer) {
                return textLength + range.startOffset;
            }

            if (isNodeOfType(node, 'TEXT_NODE')) {
                textLength += node.length;
            }
        }
    }

    return textLength + range.startOffset;
}
