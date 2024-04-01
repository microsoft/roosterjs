import type { CacheSelection, DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the given selections are the same
 */
export function areSameSelection(sel1: DOMSelection, sel2: CacheSelection): boolean {
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
            return (
                sel2.type == 'range' &&
                sel1.range.startContainer == sel2.start.node &&
                sel1.range.endContainer == sel2.end.node &&
                sel1.range.startOffset == sel2.start.offset &&
                sel1.range.endOffset == sel2.end.offset
            );
    }
}
