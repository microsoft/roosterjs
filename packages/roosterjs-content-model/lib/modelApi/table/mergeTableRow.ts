import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function mergeTableRow(
    table: ContentModelTable,
    operation: TableOperation.MergeAbove | TableOperation.MergeBelow
) {
    const sel = getSelectedCells(table);
    const mergeAbove = operation == TableOperation.MergeAbove;

    if (sel) {
        const mergingRowIndex = mergeAbove ? sel.firstRow : sel.lastRow + 1;

        if (mergingRowIndex > 0 && mergingRowIndex < table.cells.length) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                table.cells[mergingRowIndex][colIndex].spanAbove = true;
            }
        }
    }
}
