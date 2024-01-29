/**
 * Checks whether the selection was from left to right (in document order) or right to left (reverse of document order)
 * @param selection Document Selection Object
 * @returns true if reverse selection
 */
export function isSelectionReverted(selection: Selection | null | undefined): boolean {
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return (
            !range.collapsed &&
            selection.focusNode != range.endContainer &&
            selection.focusOffset != range.endOffset
        );
    }

    return false;
}
