import { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the given selection ranges are the same
 */
export function areSameRangeEx(sel1: DOMSelection, sel2: DOMSelection): boolean {
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
            return sel2.type == 'range' && areSameRanges(sel2.range, sel1.range);
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
