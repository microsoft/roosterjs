import { SelectionRangeTypes } from 'roosterjs-editor-types';
import type { Coordinates, SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * @internal
 * Check if the given selection ranges are the same
 */
export function areSameRangeEx(range1: SelectionRangeEx, range2: SelectionRangeEx): boolean {
    if (range1 == range2) {
        return true;
    }

    switch (range1.type) {
        case SelectionRangeTypes.ImageSelection:
            return (
                range2.type == SelectionRangeTypes.ImageSelection && range2.image == range1.image
            );

        case SelectionRangeTypes.TableSelection:
            return (
                range2.type == SelectionRangeTypes.TableSelection &&
                range2.table == range1.table &&
                areSameCoordinates(range2.coordinates?.firstCell, range1.coordinates?.firstCell) &&
                areSameCoordinates(range2.coordinates?.lastCell, range1.coordinates?.lastCell)
            );

        case SelectionRangeTypes.Normal:
        default:
            return (
                range2.type == SelectionRangeTypes.Normal &&
                areSameRanges(range2.ranges[0], range1.ranges[0])
            );
    }
}

function areSameRanges(r1?: Range, r2?: Range): boolean {
    return !!(
        r1 &&
        r2 &&
        r1.startContainer == r2.startContainer &&
        r1.startOffset == r2.startOffset &&
        r1.endContainer == r2.endContainer &&
        r1.endOffset == r2.endOffset
    );
}

function areSameCoordinates(c1?: Coordinates, c2?: Coordinates): boolean {
    return !!(c1 && c2 && c1.x == c2.x && c1.y == c2.y);
}
