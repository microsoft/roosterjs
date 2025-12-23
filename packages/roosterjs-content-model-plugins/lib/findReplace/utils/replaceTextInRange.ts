import { getObjectKeys, isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function replaceTextInRange(
    range: Range,
    replaceText: string,
    foundRanges: Range[]
): Range | null {
    if (
        !isNodeOfType(range.startContainer, 'TEXT_NODE') ||
        !isNodeOfType(range.endContainer, 'TEXT_NODE')
    ) {
        return null;
    }

    const textNode = range.startContainer;
    const resultContainer = range.startContainer;
    const resultOffset = range.startOffset + replaceText.length;

    const originalText = textNode.textContent || '';
    const newText =
        originalText.substring(0, range.startOffset) +
        replaceText +
        (range.endContainer == range.startContainer
            ? originalText.substring(range.endOffset, textNode.textContent?.length)
            : '');
    const pendingRanges: Record<
        number,
        {
            startContainer: Node;
            startOffset: number;
            endContainer: Node;
            endOffset: number;
        }
    > = {};

    for (let i = 0; i < foundRanges.length; i++) {
        const r = foundRanges[i];

        if (r.startContainer == range.endContainer && r.startOffset >= range.endOffset) {
            const startOffset =
                range.startContainer == range.endContainer
                    ? r.startOffset - range.endOffset + range.startOffset + replaceText.length
                    : r.startOffset - range.endOffset;
            const endOffset =
                r.startContainer == r.endContainer
                    ? startOffset + (r.endOffset - r.startOffset)
                    : r.endOffset;

            pendingRanges[i] = {
                startContainer: r.startContainer,
                endContainer: r.endContainer,
                startOffset,
                endOffset,
            };
        } else if (r.endContainer == range.startContainer && r.endOffset <= range.startOffset) {
            pendingRanges[i] = {
                startContainer: r.startContainer,
                endContainer: r.endContainer,
                startOffset: r.startOffset,
                endOffset: r.endOffset,
            };
        }
    }

    range.deleteContents();
    textNode.nodeValue = newText;

    getObjectKeys(pendingRanges).forEach(i => {
        const { startOffset, endOffset, startContainer, endContainer } = pendingRanges[i];

        safeSetRange(foundRanges[i], startContainer, startOffset, endContainer, endOffset);
    });

    safeSetRange(range, resultContainer, resultOffset, resultContainer, resultOffset);

    return range;
}

function safeSetRange(
    range: Range,
    startContainer: Node,
    startOffset: number,
    endContainer: Node,
    endOffset: number
) {
    if (
        isNodeOfType(startContainer, 'TEXT_NODE') &&
        isNodeOfType(endContainer, 'TEXT_NODE') &&
        startOffset >= 0 &&
        startOffset <= (startContainer.nodeValue?.length ?? 0) &&
        endOffset >= 0 &&
        endOffset <= (endContainer.nodeValue?.length ?? 0)
    ) {
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
    }
}
