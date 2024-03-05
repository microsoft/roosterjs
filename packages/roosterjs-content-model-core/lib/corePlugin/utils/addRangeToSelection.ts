/**
 * @internal
 */
export function addRangeToSelection(doc: Document, range: Range, isReverted: boolean = false) {
    const selection = doc.defaultView?.getSelection();

    if (selection) {
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
