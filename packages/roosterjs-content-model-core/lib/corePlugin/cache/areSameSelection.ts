import type {
    CacheSelection,
    DOMSelection,
    RangeSelection,
    RangeSelectionForCache,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the given selections are the same
 */
export function areSameSelection(sel1: DOMSelection, sel2: CacheSelection | DOMSelection): boolean {
    if (sel1 == sel2) {
        return true;
    }

    switch (sel1.type) {
        case 'image':
            return sel2.type == 'image' && sel2.image == sel1.image;

        case 'table':
            return (
                sel2.type == 'table' &&
                sel2.table == sel1.table &&
                sel2.firstColumn == sel1.firstColumn &&
                sel2.lastColumn == sel1.lastColumn &&
                sel2.firstRow == sel1.firstRow &&
                sel2.lastRow == sel1.lastRow
            );

        case 'range':
        default:
            if (sel2.type == 'range') {
                const { startContainer, startOffset, endContainer, endOffset } = sel1.range;

                if (isCacheSelection(sel2)) {
                    const { start, end } = sel2;

                    return (
                        startContainer == start.node &&
                        endContainer == end.node &&
                        startOffset == start.offset &&
                        endOffset == end.offset
                    );
                } else {
                    const { range } = sel2;

                    return (
                        startContainer == range.startContainer &&
                        endContainer == range.endContainer &&
                        startOffset == range.startOffset &&
                        endOffset == range.endOffset
                    );
                }
            } else {
                return false;
            }
    }
}

function isCacheSelection(
    sel: RangeSelectionForCache | RangeSelection
): sel is RangeSelectionForCache {
    return !!(sel as RangeSelectionForCache).start;
}
