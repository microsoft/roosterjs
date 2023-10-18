import { canMergeCells } from './canMergeCells';
import { getSelectedCells } from './getSelectedCells';
import type { TableVerticalMergeOperation } from '../../publicTypes/parameter/TableOperation';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableRow(table: ContentModelTable, operation: TableVerticalMergeOperation) {
    const sel = getSelectedCells(table);
    const mergeAbove = operation == 'mergeAbove';

    if (sel) {
        const mergingRowIndex = mergeAbove ? sel.firstRow : sel.lastRow + 1;

        if (mergingRowIndex > 0 && mergingRowIndex < table.rows.length) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                const cell = table.rows[mergingRowIndex].cells[colIndex];

                if (
                    cell &&
                    canMergeCells(
                        table.rows,
                        mergingRowIndex - 1,
                        colIndex,
                        mergingRowIndex,
                        colIndex
                    )
                ) {
                    cell.spanAbove = true;

                    let newSelectedRow = mergingRowIndex;

                    while (table.rows[newSelectedRow]?.cells[colIndex]?.spanAbove) {
                        delete table.rows[newSelectedRow].cells[colIndex].cachedElement;
                        delete table.rows[newSelectedRow].cachedElement;
                        newSelectedRow--;
                    }

                    if (table.rows[newSelectedRow]?.cells[colIndex]) {
                        table.rows[newSelectedRow].cells[colIndex].isSelected = true;

                        delete table.rows[newSelectedRow].cells[colIndex].cachedElement;
                        delete table.rows[newSelectedRow].cachedElement;
                    }

                    delete cell.cachedElement;
                }
            }
        }
    }
}
