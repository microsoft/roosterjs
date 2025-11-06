/**
 * @internal
 * Sort ranges in the order of their position in the document
 */
export function sortRanges(ranges: Range[]) {
    return ranges.sort(compareRange);
}

function compareRange(r1: Range, r2: Range): number {
    if (r1.startContainer == r2.startContainer) {
        return r1.startOffset - r2.startOffset;
    } else {
        return r1.startContainer.compareDocumentPosition(r2.startContainer) &
            Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1;
    }
}
