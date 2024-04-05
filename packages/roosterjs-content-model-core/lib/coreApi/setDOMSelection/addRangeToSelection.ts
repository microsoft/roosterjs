/**
 * @internal
 */
export function addRangeToSelection(doc: Document, range: Range, isReverted: boolean = false) {
    const selection = doc.defaultView?.getSelection();

    if (selection) {
        const currentRange = selection.rangeCount > 0 && selection.getRangeAt(0);
        if (
            currentRange &&
            currentRange.startContainer == range.startContainer &&
            currentRange.endContainer == range.endContainer &&
            currentRange.startOffset == range.startOffset &&
            currentRange.endOffset == range.endOffset
        ) {
            return;
        }
        selection.removeAllRanges();

        if (!isReverted) {
            selection.addRange(range);
        } else {
            selection.setBaseAndExtent(
                range.endContainer,
                range.endOffset,
                range.startContainer,
                range.startOffset
            );
        }
    }
}
