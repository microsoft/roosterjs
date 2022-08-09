import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createBr } from '../../modelApi/creators/createBr';

/**
 * @internal
 */
export function normalizeTable(table: ContentModelTable) {
    table.format.borderCollapse = true;
    table.format.useBorderBox = true;

    table.cells.forEach(row =>
        row.forEach(cell => {
            if (cell.blocks.length == 0) {
                addSegment(cell, createBr());
            }

            if (typeof cell.format.width === 'undefined') {
                cell.format.width = getTableCellWidth(row.length);
            }
            cell.format.useBorderBox = true;
        })
    );
}

function getTableCellWidth(columns: number): number {
    if (columns <= 4) {
        return 120;
    } else if (columns <= 6) {
        return 100;
    } else {
        return 70;
    }
}
