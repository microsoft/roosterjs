import type {
    CacheSelection,
    DOMSelection,
    RangeSelection,
    RangeSelectionForCache,
    TableSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the given selections are the same
 */
export function areSameSelections(
    sel1: DOMSelection,
    sel2: DOMSelection | CacheSelection
): boolean {
    if (sel1 == sel2) {
        return true;
    }

    switch (sel1.type) {
        case 'image':
            return sel2.type == 'image' && sel2.image == sel1.image;

        case 'table':
            return sel2.type == 'table' && areSameTableSelections(sel1, sel2);

        case 'range':
        default:
            if (sel2.type == 'range') {
                const range1 = sel1.range;

                if (isCacheSelection(sel2)) {
                    const { start, end } = sel2;

                    return (
                        range1.startContainer == start.node &&
                        range1.endContainer == end.node &&
                        range1.startOffset == start.offset &&
                        range1.endOffset == end.offset
                    );
                } else {
                    return areSameRanges(range1, sel2.range);
                }
            } else {
                return false;
            }
    }
}

function areSame<O>(o1: O, o2: O, keys: (keyof O)[]) {
    return keys.every(k => o1[k] == o2[k]);
}

const TableSelectionKeys: (keyof TableSelection)[] = [
    'table',
    'firstColumn',
    'lastColumn',
    'firstRow',
    'lastRow',
];
const RangeKeys: (keyof Range)[] = ['startContainer', 'endContainer', 'startOffset', 'endOffset'];

/**
 * @internal
 */
export function areSameTableSelections(t1: TableSelection, t2: TableSelection): boolean {
    return areSame(t1, t2, TableSelectionKeys);
}

/**
 * @internal
 */
export function areSameRanges(r1: Range, r2: Range): boolean {
    return areSame(r1, r2, RangeKeys);
}

function isCacheSelection(
    sel: RangeSelectionForCache | RangeSelection
): sel is RangeSelectionForCache {
    return !!(sel as RangeSelectionForCache).start;
}
