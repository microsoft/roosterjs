import { canMergeCells } from './canMergeCells';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function mergeTableRow(
    table: ContentModelTable,
    operation:
        | TableOperation.MergeAbove
        | TableOperation.MergeBelow
        | CompatibleTableOperation.MergeAbove
        | CompatibleTableOperation.MergeBelow
) {
    const sel = getSelectedCells(table);
    const mergeAbove = operation == TableOperation.MergeAbove;

    if (sel) {
        const mergingRowIndex = mergeAbove ? sel.firstRow : sel.lastRow + 1;

        if (mergingRowIndex > 0 && mergingRowIndex < table.cells.length) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                const cell = table.cells[mergingRowIndex][colIndex];

                if (
                    cell &&
                    canMergeCells(
                        table.cells,
                        mergingRowIndex - 1,
                        colIndex,
                        mergingRowIndex,
                        colIndex
                    )
                ) {
                    cell.spanAbove = true;

                    let newSelectedRow = mergingRowIndex;

                    while (table.cells[newSelectedRow]?.[colIndex]?.spanAbove) {
                        newSelectedRow--;
                    }

                    if (table.cells[newSelectedRow]?.[colIndex]) {
                        table.cells[newSelectedRow][colIndex].isSelected = true;

                        delete table.cells[newSelectedRow][colIndex];
                    }

                    delete cell.cachedElement;
                }
            }
        }
    }
}
